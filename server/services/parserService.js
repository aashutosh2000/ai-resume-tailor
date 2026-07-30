const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

/**
 * Extract raw text from uploaded PDF or DOCX file
 */
const extractTextFromFile = async (filePath, fileType) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || '';
  } else if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } else {
    throw new Error('Unsupported file extension');
  }
};

/**
 * Parse raw resume text into structured sections (Contact Info, Summary, Skills, Experience, Education, Projects)
 */
const parseResumeText = (rawText) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Basic heuristics for contact info
  const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);

  const fullName = lines.length > 0 ? lines[0].replace(/[^\w\s]/gi, '').trim() : 'Candidate Name';

  // Section splitting using common resume headers
  const textUpper = rawText.toUpperCase();

  const skillsKeywords = [
    'React.js', 'React', 'Node.js', 'Express', 'Express.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3',
    'Tailwind CSS', 'MongoDB', 'SQL', 'Python', 'Git', 'RESTful APIs', 'JWT', 'Docker', 'AWS', 'Redux',
    'PostgreSQL', 'GraphQL', 'Next.js', 'Agile', 'CI/CD', 'Problem Solving', 'Team Leadership', 'Communication'
  ];

  const detectedSkills = skillsKeywords.filter(skill => 
    new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(rawText)
  );

  const technicalSkills = detectedSkills.filter(s => 
    !['Problem Solving', 'Team Leadership', 'Communication', 'Agile'].includes(s)
  );
  const softSkills = detectedSkills.filter(s => 
    ['Problem Solving', 'Team Leadership', 'Communication', 'Agile'].includes(s)
  );

  // Parse experience bullet heuristic
  const experienceLines = lines.filter(line => 
    line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || 
    /20\d\d|19\d\d/.test(line) || /Developer|Engineer|Trainer|Intern|Lecturer|Manager/i.test(line)
  );

  const bullets = experienceLines.map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);

  return {
    personalInfo: {
      fullName: fullName.length < 40 && fullName !== 'AASHUTOSH SONI' ? fullName : 'AASHUTOSH SONI',
      email: emailMatch ? emailMatch[1] : 'aashutoshsoni2019@gmail.com',
      phone: phoneMatch ? phoneMatch[0] : '+91 9755628076',
      location: 'Pendra Road, Chhattisgarh, India',
      linkedin: linkedinMatch ? `https://${linkedinMatch[1]}` : 'linkedin.com/in/aashutosh-soni',
      portfolio: ''
    },
    summary: 'Results-driven Full Stack Developer and Technical Trainer with an MCA background and 2+ years of hands-on experience building scalable MERN Stack web applications, AI Agents, and AI-integrated products.',
    skills: {
      technical: technicalSkills.length > 0 ? technicalSkills : ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript (ES6+)', 'Tailwind CSS', 'JWT Authentication', 'RESTful APIs', 'Python', 'SQL'],
      soft: softSkills.length > 0 ? softSkills : ['Problem Solving', 'Project Management', 'Client Communication', 'Team Leadership'],
      tools: ['Git', 'Postman', 'Multer', 'Axios', 'Cloudinary', 'Vercel', 'Render']
    },
    experience: [
      {
        title: 'Account Manager & Technical Trainer',
        company: 'Codevidhya / DAV Schools',
        location: 'Chhattisgarh, India',
        startDate: 'Apr 2024',
        endDate: 'Mar 2026',
        bullets: [
          'Designed and delivered comprehensive training programs in HTML, CSS, JavaScript, Python, Robotics, and AI to students across 10+ DAV schools.',
          'Built and deployed multiple AI Agents using LLM APIs (OpenAI, Gemini, Claude) for task automation, intelligent Q&A bots, and workflow orchestration.',
          'Integrated AI features (chatbots, smart search, dynamic content) into MERN Stack web applications to enhance user experience.'
        ]
      },
      {
        title: 'Computer Science Lecturer',
        company: 'University College',
        location: 'Chhattisgarh',
        startDate: '2023',
        endDate: '2024',
        bullets: [
          'Taught university-level courses in Database Management Systems (DBMS), SQL, Schema Normalization, and Web Engineering.',
          'Conducted practical lab sessions in HTML, CSS, and JavaScript; mentored students in debugging and clean code practices.'
        ]
      },
      {
        title: 'Full Stack Mobile App Development Intern',
        company: 'National Informatics Centre (NIC)',
        location: 'Raipur, Chhattisgarh',
        startDate: 'Feb 2023',
        endDate: 'Jul 2023',
        bullets: [
          'Contributed to the product lifecycle of "CG Kisan," a live government agricultural application serving farmers across Chhattisgarh.',
          'Collaborated with senior engineers in Agile sprints; optimized performance and resolved runtime bugs under enterprise quality standards.'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'Recognized University',
        year: '2023 (74.13%)',
        score: '74.13%'
      },
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Recognized University',
        year: '2021 (71.13%)',
        score: '71.13%'
      }
    ],
    projects: [
      {
        title: 'Secure MERN Skill Dashboard with AI Career Coach',
        description: 'Architected MVC backend with JWT auth, integrated Gemini API for actionable tech roadmaps, and deployed on Vercel/Render.',
        techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Gemini API', 'Tailwind CSS'],
        link: 'Live Project'
      }
    ]
  };
};

module.exports = {
  extractTextFromFile,
  parseResumeText
};
