const natural = require('natural');
const Contact = require('../models/Contact');
const Reminder = require('../models/Reminder');
const claudeService = require('../services/claudeService');

// Initialize the Claude service
claudeService.init();

// Keep the existing classifier as fallback
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

// Train the classifier with example queries and their intents
classifier.addDocument('find contacts in team', 'search_contacts_team');
classifier.addDocument('search for contacts in team', 'search_contacts_team');
classifier.addDocument('show me contacts in team', 'search_contacts_team');

classifier.addDocument('find contacts with role', 'search_contacts_role');
classifier.addDocument('search for contacts with role', 'search_contacts_role');
classifier.addDocument('show me contacts with role', 'search_contacts_role');

classifier.addDocument('remind me to contact', 'set_reminder');
classifier.addDocument('set a reminder for', 'set_reminder');
classifier.addDocument('create a reminder to', 'set_reminder');

classifier.addDocument('who have I not contacted recently', 'cold_contacts');
classifier.addDocument('contacts I haven\'t reached out to', 'cold_contacts');
classifier.addDocument('show me cold contacts', 'cold_contacts');

classifier.addDocument('generate a report on', 'generate_report');
classifier.addDocument('create a report about', 'generate_report');
classifier.addDocument('show me a report of', 'generate_report');

classifier.addDocument('how should I engage with', 'engagement_advice');
classifier.addDocument('what should I talk about with', 'engagement_advice');
classifier.addDocument('give me talking points for', 'engagement_advice');

classifier.train();

/**
 * Process a natural language query from the chatbot interface
 * @route POST /api/chatbot/query
 * @access Private
 */
const processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    let intent, entities;
    
    try {
      // Try to use Claude for advanced NLP
      const claudeResponse = await claudeService.processQuery(query, {
        userId: req.user._id
      });
      
      intent = claudeResponse.intent;
      entities = claudeResponse.entities;
      
      console.log('Claude processing result:', { intent, entities });
    } catch (error) {
      console.error('Error using Claude service, falling back to local NLP:', error);
      
      // Fallback to local NLP if Claude service fails
      const tokens = tokenizer.tokenize(query.toLowerCase());
      intent = classifier.classify(query.toLowerCase());
      entities = null;
    }
    
    let response;
    
    // Process the query based on the identified intent
    switch (intent) {
      case 'search_contacts_team':
        response = await handleSearchContactsByTeam(query, req.user._id, entities);
        break;
      
      case 'search_contacts_role':
        response = await handleSearchContactsByRole(query, req.user._id, entities);
        break;
      
      case 'set_reminder':
        response = await handleSetReminder(query, req.user._id, entities);
        break;
      
      case 'cold_contacts':
        response = await handleColdContacts(query, req.user._id, entities);
        break;
      
      case 'generate_report':
        response = await handleGenerateReport(query, req.user._id, entities);
        break;
      
      case 'engagement_advice':
        response = await handleEngagementAdvice(query, req.user._id, entities);
        break;
      
      default:
        // For unknown intents, try to extract entities and make a best guess
        response = {
          type: 'text',
          content: 'I\'m not sure how to process that query. Try asking in a different way or use more specific language.'
        };
    }
    
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing chatbot query' });
  }
};

/**
 * Handle search for contacts by team
 */
async function handleSearchContactsByTeam(query, userId, entities = null) {
  // Extract team name from entities if available, otherwise use regex
  let team;
  
  if (entities && entities.team) {
    team = entities.team;
  } else {
    // Fallback to regex extraction
    const teamMatches = query.match(/team\s+([a-zA-Z\s]+)/i) || query.match(/in\s+([a-zA-Z\s]+)/i);
    
    if (!teamMatches || !teamMatches[1]) {
      return {
        type: 'text',
        content: 'Which team would you like to search for?'
      };
    }
    
    team = teamMatches[1].trim();
  }
  
  const contacts = await Contact.find({
    user: userId,
    team: { $regex: team, $options: 'i' }
  });
  
  if (contacts.length === 0) {
    return {
      type: 'text',
      content: `I couldn't find any contacts in the team "${team}".`
    };
  }
  
  return {
    type: 'contacts',
    content: contacts,
    message: `Found ${contacts.length} contacts in the team "${team}".`
  };
}

/**
 * Handle search for contacts by role
 */
async function handleSearchContactsByRole(query, userId, entities = null) {
  // Extract role from entities if available, otherwise use regex
  let role;
  
  if (entities && entities.role) {
    role = entities.role;
  } else {
    // Fallback to regex extraction
    const roleMatches = query.match(/role\s+([a-zA-Z\s]+)/i) || query.match(/with\s+([a-zA-Z\s]+)\s+role/i);
    
    if (!roleMatches || !roleMatches[1]) {
      return {
        type: 'text',
        content: 'Which role would you like to search for?'
      };
    }
    
    role = roleMatches[1].trim();
  }
  
  const contacts = await Contact.find({
    user: userId,
    role: { $regex: role, $options: 'i' }
  });
  
  if (contacts.length === 0) {
    return {
      type: 'text',
      content: `I couldn't find any contacts with the role "${role}".`
    };
  }
  
  return {
    type: 'contacts',
    content: contacts,
    message: `Found ${contacts.length} contacts with the role "${role}".`
  };
}

/**
 * Handle setting a reminder
 */
async function handleSetReminder(query, userId, entities = null) {
  // Extract contact name and timeframe from entities if available
  let contactName, timeframe;
  
  if (entities) {
    contactName = entities.contactName;
    timeframe = entities.timeframe;
  }
  
  // Fallback to regex extraction if entities not available
  if (!contactName) {
    const contactMatch = query.match(/contact\s+([a-zA-Z\s]+)\s+in/i) || query.match(/reminder\s+for\s+([a-zA-Z\s]+)/i);
    
    if (!contactMatch || !contactMatch[1]) {
      return {
        type: 'text',
        content: 'For whom would you like to set a reminder?'
      };
    }
    
    contactName = contactMatch[1].trim();
  }
  
  // Find the contact in the database
  const contact = await Contact.findOne({
    user: userId,
    name: { $regex: contactName, $options: 'i' }
  });
  
  if (!contact) {
    return {
      type: 'text',
      content: `I couldn't find a contact named "${contactName}".`
    };
  }
  
  // Calculate due date based on timeframe
  let dueDate = new Date();
  
  if (timeframe && timeframe.amount && timeframe.unit) {
    const { amount, unit } = timeframe;
    
    if (unit.includes('day')) {
      dueDate.setDate(dueDate.getDate() + amount);
    } else if (unit.includes('week')) {
      dueDate.setDate(dueDate.getDate() + (amount * 7));
    } else if (unit.includes('month')) {
      dueDate.setMonth(dueDate.getMonth() + amount);
    }
  } else if (!timeframe) {
    // Try to extract using regex as fallback
    const timeMatch = query.match(/in\s+(\d+)\s+(day|days|week|weeks|month|months)/i);
    
    if (timeMatch && timeMatch[1] && timeMatch[2]) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      if (unit === 'day' || unit === 'days') {
        dueDate.setDate(dueDate.getDate() + amount);
      } else if (unit === 'week' || unit === 'weeks') {
        dueDate.setDate(dueDate.getDate() + (amount * 7));
      } else if (unit === 'month' || unit === 'months') {
        dueDate.setMonth(dueDate.getMonth() + amount);
      }
    } else {
      // Default to 1 week if no timeframe specified
      dueDate.setDate(dueDate.getDate() + 7);
    }
  }
  
  // Create the reminder
  const reminder = new Reminder({
    user: userId,
    contact: contact._id,
    dueDate,
    description: `Follow up with ${contact.name}`,
    priority: 'medium'
  });
  
  await reminder.save();
  
  return {
    type: 'reminder',
    content: reminder,
    message: `I've set a reminder to contact ${contact.name} on ${dueDate.toLocaleDateString()}.`
  };
}

/**
 * Handle cold contacts query
 */
async function handleColdContacts(query, userId, entities = null) {
  // Extract timeframe if present from entities
  let dayThreshold = 30; // Default to 30 days
  
  if (entities && entities.timeframe) {
    const { amount, unit } = entities.timeframe;
    
    if (unit.includes('day')) {
      dayThreshold = amount;
    } else if (unit.includes('week')) {
      dayThreshold = amount * 7;
    } else if (unit.includes('month')) {
      dayThreshold = amount * 30;
    }
  } else {
    // Extract timeframe if present using regex as fallback
    const timeMatch = query.match(/in\s+(\d+)\s+(day|days|week|weeks|month|months)/i) || 
                  query.match(/for\s+(\d+)\s+(day|days|week|weeks|month|months)/i);
    
    if (timeMatch && timeMatch[1] && timeMatch[2]) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      if (unit === 'day' || unit === 'days') {
        dayThreshold = amount;
      } else if (unit === 'week' || unit === 'weeks') {
        dayThreshold = amount * 7;
      } else if (unit === 'month' || unit === 'months') {
        dayThreshold = amount * 30;
      }
    }
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - dayThreshold);
  
  const contacts = await Contact.find({
    user: userId,
    $or: [
      { lastContactedDate: { $lte: cutoffDate } },
      { lastContactedDate: { $exists: false } }
    ]
  }).sort({ lastContactedDate: 1 });
  
  if (contacts.length === 0) {
    return {
      type: 'text',
      content: `You don't have any contacts you haven't reached out to in the last ${dayThreshold} days.`
    };
  }
  
  return {
    type: 'contacts',
    content: contacts,
    message: `Found ${contacts.length} contacts you haven't reached out to in the last ${dayThreshold} days.`
  };
}

/**
 * Handle generate report query
 */
async function handleGenerateReport(query, userId, entities = null) {
  // Extract report type from entities if available
  let reportType;
  
  if (entities && entities.reportType) {
    reportType = entities.reportType.toLowerCase();
  } else {
    // Extract report type using regex as fallback
    const typeMatch = query.match(/report\s+on\s+([a-zA-Z\s]+)/i) || 
                  query.match(/report\s+about\s+([a-zA-Z\s]+)/i) ||
                  query.match(/report\s+of\s+([a-zA-Z\s]+)/i);
    
    if (!typeMatch || !typeMatch[1]) {
      return {
        type: 'text',
        content: 'What kind of report would you like to generate?'
      };
    }
    
    reportType = typeMatch[1].trim().toLowerCase();
  }
  
  // Handle different report types
  if (reportType.includes('team') || reportType.includes('teams')) {
    // Generate team distribution report
    const pipeline = [
      { $match: { user: userId } },
      { $group: { _id: '$team', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];
    
    const teamDistribution = await Contact.aggregate(pipeline);
    
    return {
      type: 'chart',
      chartType: 'bar',
      title: 'Contact Distribution by Team',
      labels: teamDistribution.map(item => item._id || 'Unspecified'),
      data: teamDistribution.map(item => item.count),
      message: 'Here\'s the distribution of your contacts by team.'
    };
  } else if (reportType.includes('company') || reportType.includes('companies')) {
    // Generate company distribution report
    const pipeline = [
      { $match: { user: userId } },
      { $group: { _id: '$currentCompany', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // Limit to top 10 companies
    ];
    
    const companyDistribution = await Contact.aggregate(pipeline);
    
    return {
      type: 'chart',
      chartType: 'pie',
      title: 'Contact Distribution by Company',
      labels: companyDistribution.map(item => item._id || 'Unspecified'),
      data: companyDistribution.map(item => item.count),
      message: 'Here\'s the distribution of your contacts by company.'
    };
  } else if (reportType.includes('temperature') || reportType.includes('engagement')) {
    // Generate temperature distribution report
    const pipeline = [
      { $match: { user: userId } },
      { $group: { _id: '$temperature', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];
    
    const temperatureDistribution = await Contact.aggregate(pipeline);
    
    return {
      type: 'chart',
      chartType: 'pie',
      title: 'Contact Distribution by Temperature',
      labels: temperatureDistribution.map(item => item._id || 'Unspecified'),
      data: temperatureDistribution.map(item => item.count),
      message: 'Here\'s the distribution of your contacts by temperature.'
    };
  } else {
    return {
      type: 'text',
      content: `I'm not sure how to generate a report on "${reportType}". Try asking for a report on teams, companies, or engagement levels.`
    };
  }
}

/**
 * Handle engagement advice query
 */
async function handleEngagementAdvice(query, userId, entities = null) {
  // Extract contact name from entities if available
  let contactName;
  
  if (entities && entities.contactName) {
    contactName = entities.contactName;
  } else {
    // Extract contact name using regex as fallback
    const contactMatch = query.match(/with\s+([a-zA-Z\s]+)/i) || 
                      query.match(/for\s+([a-zA-Z\s]+)/i);
    
    if (!contactMatch || !contactMatch[1]) {
      return {
        type: 'text',
        content: 'Which contact would you like engagement advice for?'
      };
    }
    
    contactName = contactMatch[1].trim();
  }
  
  // Find the contact in the database
  const contact = await Contact.findOne({
    user: userId,
    name: { $regex: contactName, $options: 'i' }
  });
  
  if (!contact) {
    return {
      type: 'text',
      content: `I couldn't find a contact named "${contactName}".`
    };
  }
  
  try {
    // Use Claude's enhanced capabilities for engagement advice
    return await claudeService.generateEngagementAdvice(contact);
  } catch (error) {
    console.error('Error using Claude for engagement advice, falling back to basic advice:', error);
    
    // Fallback to basic engagement advice generation
    let advicePoints = [];
    
    // Add advice based on accomplishments
    if (contact.accomplishments && contact.accomplishments.length > 0) {
      const recentAccomplishment = contact.accomplishments[contact.accomplishments.length - 1];
      advicePoints.push(`Mention their recent accomplishment: "${recentAccomplishment.title}".`);
    }
    
    // Add advice based on overlap points
    if (contact.overlapPoints && contact.overlapPoints.length > 0) {
      const overlaps = contact.overlapPoints.map(point => point.description).join('" and "');
      advicePoints.push(`Connect over your shared background in "${overlaps}".`);
    }
    
    // Add advice based on time in role
    if (contact.timeInRole) {
      if (contact.timeInRole < 6) {
        advicePoints.push('They\'re relatively new in their role. Ask how the transition has been going.');
      } else if (contact.timeInRole > 24) {
        advicePoints.push('They have significant experience in their current role. Ask about their biggest learnings or achievements.');
      }
    }
    
    // Add advice based on last communication
    if (contact.communications && contact.communications.length > 0) {
      const lastComm = contact.communications[contact.communications.length - 1];
      advicePoints.push(`In your last interaction on ${new Date(lastComm.date).toLocaleDateString()}, you discussed: "${lastComm.content}". Follow up on this topic.`);
    }
    
    // Add general advice based on temperature
    switch (contact.temperature) {
      case 'cold':
        advicePoints.push('This is a cold contact. Focus on establishing trust and providing value before asking for anything.');
        break;
      case 'warm':
        advicePoints.push('This is a warm contact. Deepen the relationship by finding ways to help them achieve their goals.');
        break;
      case 'hot':
        advicePoints.push('This is a hot contact. They\'re receptive to your outreach, so don\'t hesitate to make specific requests or proposals.');
        break;
    }
    
    return {
      type: 'advice',
      contact: contact,
      advice: advicePoints,
      message: `Here's my advice for engaging with ${contact.name}:`
    };
  }
}

module.exports = {
  processQuery
};