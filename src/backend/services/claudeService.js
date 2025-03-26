const axios = require('axios');

/**
 * Service for interacting with Claude AI to enhance the chatbot capabilities
 */
class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Initialize the Claude service with system instructions
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    // System instructions to guide Claude's behavior
    this.systemPrompt = options.systemPrompt || 
      `You are an AI assistant for a CRM system. Your job is to help users manage their contacts, set reminders, and provide insights about their professional network.
      
      You can help with the following tasks:
      1. Finding contacts based on team, role, or other attributes
      2. Setting reminders to follow up with contacts
      3. Identifying contacts that haven't been reached out to recently
      4. Generating reports about contact distribution
      5. Providing advice on how to engage with specific contacts
      
      When a user asks a question, determine their intent and extract relevant entities like names, teams, roles, time periods, etc.
      For data requests, return structured data that can be used to query a MongoDB database.`;
  }

  /**
   * Process a query using Claude's API to determine intent and extract entities
   * @param {string} query - The natural language query from the user
   * @param {Object} userData - Additional user data to provide context
   * @returns {Promise<Object>} - Processed intent and entities
   */
  async processQuery(query, userData = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Claude API key is not configured');
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: "claude-3-opus-20240229",
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: this.systemPrompt
            },
            {
              role: "user",
              content: `Query: ${query}\n\nPlease analyze this query and provide a structured response with:
              1. The user's intent (search_contacts_team, search_contacts_role, set_reminder, cold_contacts, generate_report, engagement_advice)
              2. Any relevant entities extracted (contact names, teams, roles, timeframes, etc.)
              3. Add any context you can infer from the query`
            }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          }
        }
      );

      // Parse Claude's response to extract structured intent and entities
      const aiResponse = response.data.content[0].text;
      
      // Convert AI response text to structured data
      // This is a simple parsing implementation - you may need to enhance this
      // based on the format of Claude's responses
      const intentMatch = aiResponse.match(/intent:\s*(\w+)/i);
      const intent = intentMatch ? intentMatch[1].toLowerCase() : null;
      
      // Extract all potential entities
      const entities = {
        contactName: extractEntity(aiResponse, 'contact name', 'name'),
        team: extractEntity(aiResponse, 'team'),
        role: extractEntity(aiResponse, 'role'),
        timeframe: extractTimeframe(aiResponse),
        reportType: extractEntity(aiResponse, 'report type')
      };

      return {
        intent,
        entities,
        raw: aiResponse // Include raw response for debugging
      };
    } catch (error) {
      console.error('Error processing query with Claude:', error);
      throw error;
    }
  }

  /**
   * Generate engagement advice using Claude's more advanced capabilities
   * @param {Object} contact - The contact data
   * @returns {Promise<Object>} - Engagement advice
   */
  async generateEngagementAdvice(contact) {
    try {
      if (!this.apiKey) {
        throw new Error('Claude API key is not configured');
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: "You are an expert CRM assistant helping with relationship building. Provide specific, actionable advice for engaging with contacts."
            },
            {
              role: "user",
              content: `I need advice on engaging with this contact:
              
              Name: ${contact.name}
              Role: ${contact.role || 'Unknown'}
              Company: ${contact.currentCompany || 'Unknown'}
              Time in role: ${contact.timeInRole || 0} months
              Previous companies: ${contact.previousCompanies?.map(c => c.name).join(', ') || 'None recorded'}
              Temperature: ${contact.temperature || 'cold'}
              Last contacted: ${contact.lastContactedDate ? new Date(contact.lastContactedDate).toLocaleDateString() : 'Never'}
              
              Accomplishments: ${contact.accomplishments?.map(a => a.title).join(', ') || 'None recorded'}
              
              Overlap points: ${contact.overlapPoints?.map(p => p.description).join(', ') || 'None recorded'}
              
              Recent communications: ${contact.communications?.slice(-2).map(c => `(${new Date(c.date).toLocaleDateString()}) ${c.content}`).join('; ') || 'None recorded'}
              
              Notes: ${contact.notes || 'None'}
              
              Please provide 3-5 specific conversation points and engagement strategies for my upcoming interaction with this contact.`
            }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const adviceText = response.data.content[0].text;
      
      // Convert the advice text to structured points
      const advicePoints = adviceText
        .split(/\d+\.\s+/)  // Split on numbered points
        .filter(point => point.trim().length > 0) // Remove empty entries
        .map(point => point.trim());

      return {
        type: 'advice',
        contact: contact,
        advice: advicePoints,
        message: `Here's my advice for engaging with ${contact.name}:`
      };
    } catch (error) {
      console.error('Error generating engagement advice with Claude:', error);
      throw error;
    }
  }
}

/**
 * Extract entity from Claude's response based on entity type
 * @param {string} text - The response text from Claude
 * @param {string} entityType - The type of entity to extract
 * @param {string} [altType] - Alternative name for the entity type
 * @returns {string|null} - Extracted entity or null
 */
function extractEntity(text, entityType, altType = null) {
  const regexes = [
    new RegExp(`${entityType}:\\s*"?([^"\\n]+)"?`, 'i'),
    new RegExp(`${entityType}:\\s*([^\\n]+)`, 'i')
  ];
  
  if (altType) {
    regexes.push(new RegExp(`${altType}:\\s*"?([^"\\n]+)"?`, 'i'));
    regexes.push(new RegExp(`${altType}:\\s*([^\\n]+)`, 'i'));
  }
  
  for (const regex of regexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Extract timeframe from Claude's response
 * @param {string} text - The response text from Claude
 * @returns {Object|null} - Extracted timeframe or null
 */
function extractTimeframe(text) {
  const amountMatch = text.match(/timeframe:.*?(\d+)/i) || 
                     text.match(/time period:.*?(\d+)/i) ||
                     text.match(/time frame:.*?(\d+)/i);
  
  const unitMatch = text.match(/timeframe:.*?\d+\s+([a-z]+)/i) ||
                   text.match(/time period:.*?\d+\s+([a-z]+)/i) ||
                   text.match(/time frame:.*?\d+\s+([a-z]+)/i);
  
  if (amountMatch && amountMatch[1] && unitMatch && unitMatch[1]) {
    return {
      amount: parseInt(amountMatch[1]),
      unit: unitMatch[1].toLowerCase()
    };
  }
  
  return null;
}

module.exports = new ClaudeService();