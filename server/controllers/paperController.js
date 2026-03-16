const Paper = require('../models/Paper');
const cloudinary = require('../config/cloudinary');

const paperPopulate = {
  path: 'uploader',
  select: 'name email profilePicture role',
};

const getPaperFilename = (paper) => {
  const fallbackExt = paper.fileType === 'pdf' ? '.pdf' : '';
  const rawName = (paper.publicId || 'paper').split('/').pop();
  return rawName.includes('.') ? rawName : `${rawName}${fallbackExt}`;
};

const getCloudinaryFetchUrls = (paper) => {
  const urls = [];

  if (paper.fileUrl) {
    urls.push(paper.fileUrl);
  }

  if (!paper.publicId) {
    return urls;
  }

  if (paper.fileType === 'pdf') {
    urls.push(
      cloudinary.url(paper.publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
      })
    );
    urls.push(
      cloudinary.url(paper.publicId, {
        resource_type: 'image',
        type: 'upload',
        secure: true,
        format: 'pdf',
      })
    );
  } else {
    urls.push(
      cloudinary.url(paper.publicId, {
        resource_type: 'image',
        type: 'upload',
        secure: true,
      })
    );
  }

  return [...new Set(urls.filter(Boolean))];
};

const getCloudinaryResource = async (paper) => {
  if (!paper.publicId) {
    return null;
  }

  const resourceTypes = paper.fileType === 'pdf' ? ['image', 'raw'] : ['image'];

  for (const resourceType of resourceTypes) {
    try {
      const resource = await cloudinary.api.resource(paper.publicId, {
        resource_type: resourceType,
      });

      if (resource?.secure_url) {
        return {
          secureUrl: resource.secure_url,
          resourceType,
        };
      }
    } catch (error) {
      if (error?.http_code !== 404) {
        console.warn(`Cloudinary resource lookup warning for ${paper.publicId}:`, error.message);
      }
    }
  }

  return null;
};

const deletePaperFromCloudinary = async (paper) => {
  if (!paper?.publicId) {
    return;
  }

  const resourceTypes = paper.fileType === 'pdf' ? ['raw', 'image'] : ['image'];

  for (const resourceType of resourceTypes) {
    try {
      await cloudinary.uploader.destroy(paper.publicId, { resource_type: resourceType });
      return;
    } catch (error) {
      console.warn(`Cloudinary delete warning for ${paper.publicId} (${resourceType}):`, error.message);
    }
  }
};

// @desc    Upload a new paper
// @route   POST /api/papers/upload
// @access  Private
const uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { courseName, courseCode, slot, examType, category } = req.body;

    if (!courseName || !courseCode || !slot || !examType || !category) {
      // Remove uploaded file from cloudinary if validation fails
      await deletePaperFromCloudinary({
        publicId: req.file.filename,
        fileType: req.file.mimetype === 'application/pdf' ? 'pdf' : 'image',
      });
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const isPDF = req.file.mimetype === 'application/pdf';

    const paper = new Paper({
      courseName: courseName.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      slot: slot.trim().toUpperCase(),
      examType,
      category,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileType: isPDF ? 'pdf' : 'image',
      uploader: req.user._id,
    });

    await paper.save();
    await paper.populate(paperPopulate);

    res.status(201).json({
      success: true,
      message: 'Paper uploaded successfully!',
      data: paper,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during upload.',
    });
  }
};

// @desc    Get all papers with optional filters
// @route   GET /api/papers
// @access  Public
const getPapers = async (req, res) => {
  try {
    const { courseName, courseCode, slot, examType, category } = req.query;
    const filter = {};

    if (courseName) filter.courseName = { $regex: courseName, $options: 'i' };
    if (courseCode) filter.courseCode = { $regex: courseCode, $options: 'i' };
    if (slot) filter.slot = { $regex: slot, $options: 'i' };
    if (examType) filter.examType = examType;
    if (category) filter.category = category;

    const papers = await Paper.find(filter).populate(paperPopulate).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get slot papers only (current papers)
// @route   GET /api/papers/slot
// @access  Public
const getSlotPapers = async (req, res) => {
  try {
    const { courseName, courseCode, slot, examType } = req.query;
    const filter = { category: 'Slot Paper' };

    if (courseName) filter.courseName = { $regex: courseName, $options: 'i' };
    if (courseCode) filter.courseCode = { $regex: courseCode, $options: 'i' };
    if (slot) filter.slot = { $regex: slot, $options: 'i' };
    if (examType) filter.examType = examType;

    const papers = await Paper.find(filter).populate(paperPopulate).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get PYQs only
// @route   GET /api/papers/pyq
// @access  Public
const getPYQs = async (req, res) => {
  try {
    const { courseName, courseCode, examType } = req.query;
    const filter = { category: 'PYQ' };

    if (courseName) filter.courseName = { $regex: courseName, $options: 'i' };
    if (courseCode) filter.courseCode = { $regex: courseCode, $options: 'i' };
    if (examType) filter.examType = examType;

    const papers = await Paper.find(filter).populate(paperPopulate).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's uploaded papers
// @route   GET /api/papers/my-uploads
// @access  Private
const getMyUploadedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ uploader: req.user._id })
      .populate(paperPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete one of the current user's uploaded papers
// @route   DELETE /api/papers/:id
// @access  Private
const deleteOwnPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found.' });
    }

    if (paper.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can delete only your own uploaded files.',
      });
    }

    await deletePaperFromCloudinary(paper);
    await paper.deleteOne();

    res.status(200).json({ success: true, message: 'Paper deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all uploaded papers for admins
// @route   GET /api/admin/papers
// @access  Private/Admin
const getAllPapersForAdmin = async (req, res) => {
  try {
    const papers = await Paper.find({})
      .populate(paperPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any uploaded paper as admin
// @route   DELETE /api/admin/papers/:id
// @access  Private/Admin
const adminDeletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found.' });
    }

    await deletePaperFromCloudinary(paper);
    await paper.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Paper deleted successfully by admin.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stream a paper file with the correct content type
// @route   GET /api/papers/:id/file
// @access  Public
const getPaperFile = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found.' });
    }

    const cloudinaryResource = await getCloudinaryResource(paper);
    const candidateUrls = getCloudinaryFetchUrls(paper);

    if (cloudinaryResource?.secureUrl) {
      candidateUrls.unshift(cloudinaryResource.secureUrl);
    }

    let response = null;
    let lastStatus = null;

    for (const url of candidateUrls) {
      const currentResponse = await fetch(url);
      if (currentResponse.ok) {
        response = currentResponse;
        break;
      }
      lastStatus = currentResponse.status;
    }

    if (!response) {
      return res.status(502).json({
        success: false,
        message: `Unable to fetch the file from storage.${lastStatus ? ` Storage responded with status ${lastStatus}.` : ''}`,
      });
    }

    const contentTypeHeader = response.headers.get('content-type');
    const contentType =
      paper.fileType === 'pdf'
        ? 'application/pdf'
        : contentTypeHeader || 'application/octet-stream';

    const fileBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${getPaperFilename(paper)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    return res.send(fileBuffer);
  } catch (error) {
    console.error('File access error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while accessing file.',
    });
  }
};

module.exports = {
  uploadPaper,
  getPapers,
  getSlotPapers,
  getPYQs,
  getMyUploadedPapers,
  deleteOwnPaper,
  getAllPapersForAdmin,
  adminDeletePaper,
  getPaperFile,
};
