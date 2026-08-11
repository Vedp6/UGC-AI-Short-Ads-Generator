import * as Sentry from "@sentry/node"


Sentry.init({
  dsn: "https://9562484f11a999667e8638904a06029e@o4511823504146432.ingest.us.sentry.io/4511823519088640",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});