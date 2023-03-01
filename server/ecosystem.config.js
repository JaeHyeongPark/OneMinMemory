module.exports = {
  apps: [
    {
      script: "app.js",
      instances: "3",
      exec_mode: "cluster",
    },
  ],
};
