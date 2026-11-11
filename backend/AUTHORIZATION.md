# Route authorization

Set `JWT_SECRET` in the **backend process environment** before starting the server.
Generate a value with `openssl rand -hex 32` and store it in your deployment's secret
configuration. Do not put it in a `REACT_APP_*` variable or commit it. React's `.env`
files do not configure the backend process. There is no fallback secret. Changing
this secret invalidates existing sessions; users must log in again.

Use the shared middleware before handlers:

```js
const requirePrivilege = require('../middleware/requirePrivilege');
router.use(requirePrivilege(1)); // every handler in this router
// Or, for mixed student/staff routers:
router.get('/all', requirePrivilege(1), handler);
```

The guard verifies an HS256 JWT and queries the user's current database `superuser`
value. It accepts both `Authorization: <token>` (existing clients) and
`Authorization: Bearer <token>`. Missing/invalid/expired tokens and deleted accounts
return 401. Insufficient privileges return 403. Database errors return 500 without
running the handler. `req.user` contains the verified database id and superuser.

Level 1 is required for all answer, user, and teacher-question routes; question
listing (`/all`) and mutations; exam-time listing (`/all`) and mutations; cheat-log
reads and deletion; and registration. User promotion, demotion, deletion, and mass
registration (which creates teachers) require level 2.

Student-facing question reads, exam-time reads, cheat-log creation, execution, and
exam submission/autosave retain their existing access policies. This change is a
privilege boundary, not per-teacher ownership isolation: staff can still access
other teachers' records. Existing default-admin bootstrapping also remains;
replace its default password before exposing a deployment.

The frontend's `src/apiAuth.js` interceptor attaches the current login token to
requests targeting the configured API only.

Run the mocked-database HTTP tests with:

```sh
node --test backend/test/authorization.test.js
```
