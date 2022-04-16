#!/bin/bash

# get git information
getCommitId() {
  git rev-parse --short HEAD
}

getCommitMsg() {
  git log --format=%B -n 1 $(getCommitId)
}

# write version information to file
cat > version.json << EOF
{
  "id": "$(getCommitId)",
  "log": "$(getCommitMsg)"
}
EOF
