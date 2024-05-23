# CastMate Deckboard Plugin

This plugin allows deckboard activate a CastMate remote trigger. It forms a useful bridge between Deckboard and CastMate. It is only compatible with CastMate 0.5+. See https://www.github.com/LordTocs/CastMate or https://www.castmate.io/

# Developer Info

Install Asar globally `npm install -g @electron/asar`. We don't use a dev dependency because we use `npm prune --production` before running asar to package.

Running `npm run build` will clear out previous builds, compile the typescript, and package it into a Deckboard compatible asar file.

Running `npm run test-install` will run build and copy it to the appropriate folder for Deckboard's desktop software to run using it.