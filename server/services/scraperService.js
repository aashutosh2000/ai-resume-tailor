const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape job description content from a provided URL
 */
const scrapeJobFromUrl = async (targetUrl) => {
  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Remove script, style, nav, footer, header tags
    $('script, style, nav, footer, header, noscript, iframe, svg').remove();

    // Try common job description selectors or fallback to body
    let title = $('h1').first().text().trim() || $('title').text().trim() || 'Software Engineer';
    let company = $('h2').first().text().trim() || 'Hiring Company';

    let jobText = '';
    const jobSelectors = ['.job-description', '#job-description', '.description', '[class*="description"]', 'main', 'article', 'body'];
    
    for (const selector of jobSelectors) {
      if ($(selector).length > 0) {
        jobText = $(selector).text().replace(/\s+/g, ' ').trim();
        if (jobText.length > 200) break;
      }
    }

    if (!jobText || jobText.length < 50) {
      jobText = $('body').text().replace(/\s+/g, ' ').trim();
    }

    return {
      title: title.slice(0, 100),
      company: company.slice(0, 80),
      rawText: jobText.slice(0, 8000),
      sourceUrl: targetUrl
    };
  } catch (error) {
    throw new Error(`Failed to scrape job URL: ${error.message}`);
  }
};

module.exports = {
  scrapeJobFromUrl
};
