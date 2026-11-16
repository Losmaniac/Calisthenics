# Chalk

A personal calisthenics coach that runs in the browser and installs on the iPhone home screen.

- 165 exercises with step-by-step instructions, cues, common mistakes and an animated figure, in English and Czech
- 18 progression ladders (muscle-up, handstand, planche, front and back lever, half lever, human flag, one-arm pull-up and the strength basics)
- Sessions built for your schedule: warm-up, one skill, strength pairs, a short finisher and a cool-down
- Guided player with timers and sounds, or a plain logbook view
- Level-up suggestions you confirm, records, XP, levels, weekly streaks and badges
- Short lessons with a quiz, body measurements, calendar reminders
- Works offline; optional cloud sync through your own Firebase project

## Install on iPhone

Open the site in Safari, tap Share, then **Add to Home Screen**.

## Cloud sync (optional)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and add a **Web app**. Copy the config it shows.
2. **Authentication → Sign-in method**: turn on **Email/Password**.
3. **Firestore Database → Create database** (production mode, a European location), then replace the **Rules** with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       match /users/{uid}/{rest=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
4. In Chalk open **Setup → Cloud sync**, paste the config, and create your account. On other devices paste the same config and sign in.

The config is stored only on your devices, never in this repository.

## Development

No build step: plain ES modules.

- `node --test tests/` runs the data and engine tests.
- `node tools/stamp.mjs` refreshes the offline file list and version. Run it before every deploy.
- `node tools/icons.mjs` redraws the app icons (needs `rsvg-convert`).
- `node tools/sheet.mjs [filter]` renders every figure keyframe to contact sheets in `/tmp/sheets`.

Fonts: Big Shoulders and Archivo, both under the SIL Open Font License (see `fonts/`).
