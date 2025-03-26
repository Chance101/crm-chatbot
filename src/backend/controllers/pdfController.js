const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocumentProxy } = require('pdfjs-dist');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

/**
 * Upload a PDF file
 * @route POST /api/pdf/upload
 * @access Private
 */
const uploadPdf = (req, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  });
};

/**
 * Extract text content from a PDF
 * @route POST /api/pdf/extract
 * @access Private
 */
const extractPdfText = async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }
    
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    
    const extractedText = await extractTextFromPdf(pdf);
    
    res.json({ text: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error extracting PDF content' });
  }
};

/**
 * Helper function to extract text from a PDF
 * @param {PDFDocumentProxy} pdf - The loaded PDF document
 * @returns {Promise<string>} - The extracted text
 */
async function extractTextFromPdf(pdf) {
  const numPages = pdf.numPages;
  let extractedText = '';
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    extractedText += strings.join(' ') + '\n';
  }
  
  return extractedText;
}

/**
 * Parse contact information from PDF text
 * @route POST /api/pdf/parse
 * @access Private
 */
const parseContactInfo = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'PDF text content is required' });
    }
    
    // Implement NLP-based parsing logic here
    // This is a simplified example - in a real app, you would use more
    // sophisticated NLP techniques to extract structured information
    
    const nameMatch = text.match(/name:\s*([^\n\r]+)/i) || text.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/i);
    const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/i);
    const companyMatch = text.match(/company:\s*([^\n\r]+)/i) || text.match(/at\s+([A-Z][a-zA-Z\s]+)/i);
    const roleMatch = text.match(/(?:position|title|role):\s*([^\n\r]+)/i) || text.match(/([A-Z][a-z]+\s+[A-Za-z]+)\s+at/i);
    
    const contactInfo = {
      name: nameMatch ? nameMatch[1].trim() : null,
      email: emailMatch ? emailMatch[0].trim() : null,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      currentCompany: companyMatch ? companyMatch[1].trim() : null,
      role: roleMatch ? roleMatch[1].trim() : null,
      // Extract other relevant fields
      rawText: text
    };
    
    res.json(contactInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error parsing contact information' });
  }
};

module.exports = {
  uploadPdf,
  extractPdfText,
  parseContactInfo
};
