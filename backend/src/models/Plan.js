const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
}, { _id: false });

const topPlaceSchema = new mongoose.Schema({
  name: {
    type: String
  },
  coordinates: coordinatesSchema
}, { _id: false });

const itineraryItemSchema = new mongoose.Schema({
  itineraryItem: {
    type: String
  },
  briefDescription: {
    type: String
  }
}, { _id: false });

const activitiesSchema = new mongoose.Schema({
  morning: [itineraryItemSchema],
  afternoon: [itineraryItemSchema],
  evening: [itineraryItemSchema]
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  title: {
    type: String
  },
  activities: activitiesSchema
}, { _id: false });

const contentGenerationStateSchema = new mongoose.Schema({
  imagination: {
    type: Boolean,
    default: false
  },
  abouttheplace: {
    type: Boolean,
    default: false
  },
  adventuresactivitiestodo: {
    type: Boolean,
    default: false
  },
  topplacestovisit: {
    type: Boolean,
    default: false
  },
  itinerary: {
    type: Boolean,
    default: false
  },
  localcuisinerecommendations: {
    type: Boolean,
    default: false
  },
  packingchecklist: {
    type: Boolean,
    default: false
  },
  besttimetovisit: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const planSchema = new mongoose.Schema({
  isGeneratedUsingAI: {
    type: Boolean,
    default: false
  },
  storageId: {
    type: String,
    default: null
  },  nameoftheplace: {
    type: String,
    trim: true
  },
  userPrompt: {
    type: String
  },
  abouttheplace: {
    type: String,
    default: ''
  },
  adventuresactivitiestodo: [{
    type: String
  }],
  topplacestovisit: [topPlaceSchema],
  packingchecklist: [{
    type: String
  }],
  localcuisinerecommendations: [{
    type: String
  }],  userId: {
    type: String
  },
  besttimetovisit: {
    type: String,
    default: ''
  },
  itinerary: [itineraryDaySchema],
  contentGenerationState: {
    type: contentGenerationStateSchema,
    default: () => ({})
  },
  imageUrl: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
