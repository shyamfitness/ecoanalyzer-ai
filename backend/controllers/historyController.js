import { Parser } from 'json2csv';
import dayjs from 'dayjs';
import { z } from 'zod';
import Analysis from '../models/Analysis.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const historyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  grade: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['score', 'date', 'name']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const getHistory = asyncHandler(async (req, res) => {
  const validation = historyQuerySchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ success: false, error: 'Invalid query params' });
  }

  const { page, limit, search, grade, category, startDate, endDate, sortBy, sortOrder } =
    validation.data;

  const query = { user: req.user._id };

  if (search) {
    query.$or = [
      { 'product.name': { $regex: search, $options: 'i' } },
      { 'product.description': { $regex: search, $options: 'i' } },
      { 'product.brand': { $regex: search, $options: 'i' } },
      { 'product.barcode': { $regex: search, $options: 'i' } },
    ];
  }

  if (grade && grade !== 'all') {
    query.grade = grade;
  }

  if (category && category !== 'all') {
    query['product.category'] = category;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = dayjs(startDate).toDate();
    if (endDate) query.createdAt.$lte = dayjs(endDate).endOf('day').toDate();
  }

  const sort = {
    score: { environmentalScore: sortOrder === 'asc' ? 1 : -1 },
    name: { 'product.name': sortOrder === 'asc' ? 1 : -1 },
    date: { createdAt: sortOrder === 'asc' ? 1 : -1 },
  }[sortBy];

  const [analyses, total] = await Promise.all([
    Analysis.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Analysis.countDocuments(query),
  ]);

  res.json({
    success: true,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    items: analyses.map((analysis) => analysis.toDigest()),
  });
});

export const getHistorySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totals, gradeDistribution, categoryDistribution, monthlyTrend] = await Promise.all([
    Analysis.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$environmentalScore' },
          totalAnalyses: { $sum: 1 },
        },
      },
    ]),
    Analysis.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 },
        },
      },
    ]),
    Analysis.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
        },
      },
    ]),
    Analysis.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$environmentalScore' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]),
  ]);

  res.json({
    success: true,
    summary: {
      totalAnalyses: totals[0]?.totalAnalyses || 0,
      averageScore: Number((totals[0]?.averageScore || 0).toFixed(1)),
      gradeDistribution,
      categoryDistribution,
      monthlyTrend,
    },
  });
});

export const exportHistoryCsv = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
  const parser = new Parser({
    fields: [
      { label: 'Date', value: (row) => row.createdAt.toISOString() },
      { label: 'Product', value: 'product.name' },
      { label: 'Category', value: 'product.category' },
      { label: 'Score', value: 'environmentalScore' },
      { label: 'Grade', value: 'grade' },
      { label: 'Barcode', value: 'product.barcode' },
      { label: 'Origin', value: 'product.origin' },
    ],
  });

  const csv = parser.parse(analyses);
  res.header('Content-Type', 'text/csv');
  res.attachment('ecoanalyzer-history.csv');
  return res.send(csv);
});

export const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!analysis) {
    return res.status(404).json({ success: false, error: 'Analysis not found' });
  }

  res.json({ success: true });
});

