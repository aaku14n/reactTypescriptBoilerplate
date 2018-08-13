module.exports = {
    apps: [
      {
        name: "react-boilerplate",
        script: "index.js",
        watch: true,
        env: {
          NODE_ENV: "production"
        }
      }
    ],
    deploy: {
      production: {
        user: "ubuntu",
        host: "52.14.160.34",
        key: "~/.ssh/ORACLE-HYBRIS.pem",
        ref: "origin/master",
        repo: "git@github.com:aaku14n/reactTypescriptBoilerplate.git",
        ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
        path: "/home/ubuntu/react-boilerplate",
        "post-deploy":  "yarn run pre-build"
      }
    }
  };
  