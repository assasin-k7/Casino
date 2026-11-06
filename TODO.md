# TODO

As of: 2026-10-14. Folder separation, ports, and Prisma history cleanup are now complete. Below is a job that has not yet been closed as a product..

the server is floating.

| service | address |
|--------|------|
| user site | http://localhost:3000 |
| manager | http://localhost:3001 |
| API | http://localhost:4000/api |

There is code for the original game, wallet, fairness, chat, and admin screen. The Dice screen and the three server responses were confirmed. The path through which money moves after logging in has not yet been completed..

## Actions to check first

- [ ] tester Check login, deposit, dice betting, balance changes, and administrator betting list at once
- [ ] manager `admin@501.local` After logging in, check whether the dashboard, user, and withdrawal screen match the API.
- [ ] Rosa hub(`localhost:5005`)Attach and synchronize the game to LIVE and check the slot real/demo iframe. If there is no hub, the slot remains ready.

## Screen-only items

- [ ] Live casino, game shows, and roulette only have images and indications that they are being prepared. There is no real launcher
- [ ] Sports, promotions, bonus battles, jackpots, dual arenas, challenges, clans, roller coasters, sidebets, and daily races only have menus and no pages.
- [ ] Help, Terms of Use, Privacy, and Responsible Gambling links only go to Home
- [ ] Habanero The provider logo uses Pragmatic SVG as is.
