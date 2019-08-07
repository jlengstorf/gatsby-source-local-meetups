const axios = require("axios")

// 2. Send a call to the Meetup API to retrieve events by category
exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const { apiKey, category, maxEvents = 20, latitude, longitude } = options

  const result = await axios({
    method: "GET",
    url: "https://api.meetup.com/find/upcoming_events",
    params: {
      key: apiKey,
      topic_category: category,
      page: maxEvents,
      sign: "true",
      lat: latitude,
      lon: longitude,
    },
  }).catch(error => {
    console.error(error.message)
  })

  const events = result.data.events

  events.forEach(event => {
    const node = {
      ...event,
      id: createNodeId(`MeetupEvent-${event.id}`),
      internal: {
        type: "MeetupEvent",
        contentDigest: createContentDigest(event),
      },
    }

    actions.createNode(node)
  })
}
