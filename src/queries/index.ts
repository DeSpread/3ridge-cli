// All GraphQL queries — read-only operations ONLY.
// Mutations are isolated in src/auth/login.ts (loginByEmail + token refresh only).

export const EVENTS_QUERY = `
  query events($isVisible: Boolean) {
    events(isVisible: $isVisible) {
      _id
      title
      description
      image
      questCounts
      isVisible
      beginDate
      untilDate
      createdAt
      updatedAt
      reward {
        type
        description
        point
        prizes { name method winnerLimit }
      }
      project { _id name image }
      participants { _id }
    }
  }
`;

export const EVENT_QUERY = `
  query event($_id: String!) {
    event(_id: $_id) {
      _id
      title
      description
      image
      questCounts
      isVisible
      beginDate
      untilDate
      createdAt
      updatedAt
      reward {
        type
        description
        point
        prizes { name method winnerLimit }
      }
      project { _id name description image socials { discord medium website telegram twitter youtube } }
      participants { _id profileImage }
    }
  }
`;

export const PROJECTS_QUERY = `
  query projects {
    projects {
      _id
      name
      description
      image
      socials { discord medium website telegram naverBlog twitter kakaotalk youtube }
    }
  }
`;

export const PROJECT_QUERY = `
  query project($_id: String!) {
    project(_id: $_id) {
      _id
      name
      description
      image
      socials { discord medium website telegram naverBlog twitter kakaotalk youtube }
    }
  }
`;

export const QUESTS_QUERY = `
  query quests($eventId: String!) {
    quests(eventId: $eventId) {
      _id
      displayText
      type
      ... on DiscordJoinQuest { createdAt updatedAt discordGuildId discordGuildInviteUrl }
      ... on TelegramJoinQuest { createdAt updatedAt telegramChannelId }
      ... on QuizQuest { createdAt updatedAt quizes { question choices correctAnswer } }
      ... on SurveyQuest { createdAt updatedAt surveyQuestions { _id text } }
      ... on TwitterFollowQuest { createdAt updatedAt twitterId }
      ... on TwitterLikeQuest { createdAt updatedAt tweetId }
      ... on TwitterRetweetQuest { createdAt updatedAt tweetId }
      ... on UploadScreenshotQuest { createdAt updatedAt }
      ... on VisitWebQuest { createdAt updatedAt targetUrl }
      ... on BasicQuest { createdAt updatedAt }
      ... on VooiTelegramQuest { createdAt updatedAt }
    }
  }
`;

export const ME_QUERY = `
  query me {
    me {
      _id
      emailCredential { email }
      wallets { chainType walletAddress }
      socials { ... on Discord { type userInfo { username global_name } } ... on Telegram { type userInfo { id username } } ... on Twitter { type id name } }
      profileImage
      point
      roles
      privyId
    }
  }
`;

export const COMPLETED_QUESTS_QUERY = `
  query completedQuests($eventId: String) {
    completedQuests(eventId: $eventId) {
      user
      event
      completedQuestIds
      isCompletedEvent
    }
  }
`;

export const PARTICIPATED_EVENTS_QUERY = `
  query participatedEvents {
    participatedEvents {
      participatedEvents {
        _id title beginDate untilDate questCounts
        reward { type point }
        project { name }
      }
      completedEvents {
        _id title
      }
      participatedEventsCounts
      completedEventsCounts
    }
  }
`;

export const ADMIN_USERS_QUERY = `
  query adminUsers {
    adminUsers {
      _id
      name
      username
      roles
      privyId
      slackId
    }
  }
`;

export const SHORT_LINKS_QUERY = `
  query shortLinks {
    shortLinks {
      _id
      src
      target
      queryString
    }
  }
`;
