module.exports = {
  apps: [
    {
      script: "app.js",
      instances: "2",
      exec_mode: "cluster",
    },
  ],
};
