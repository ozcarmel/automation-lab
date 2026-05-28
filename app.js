const lessons = [
  {
    title: "Click the Button",
    short: "getByRole",
    time: "6 min",
    summary:
      "Open a page, find a button, click it, and verify the screen changed.",
    goal: "Use `page.getByRole()` to click a real button by its accessible name.",
    userAction:
      "In the Demo App, the user clicks the Start tour button. The button text should change to Tour started.",
    playwrightAction:
      "The code finds the same button by its role and visible name, then calls `.click()` on it.",
    successCheck:
      "First click Start tour manually. Then run the automation and watch it click the same button and verify Tour started.",
    conceptTitle: "Why `page.getByRole()`?",
    conceptBody: [
      { label: "Locator", value: "getByRole()", note: "A Playwright locator finds an element on the page." },
      { label: "Role", value: "button", note: "The accessibility type Playwright searches for." },
      { label: "Name", value: "Start tour", note: "The visible name that chooses the exact button." },
      { label: "Element", value: "the actual button", note: "The real control Playwright finds and clicks." }
    ],
    conceptCode: "page.getByRole('button', { name: 'Start tour' })",
    demoPath: "/welcome",
    demoTitle: "Portal welcome",
    tasks: [
      "Inspect the demo app and identify the primary button.",
      "Use a role locator instead of a brittle CSS selector.",
      "Click the button and check the success message."
    ],
    code: `import { test, expect } from '@playwright/test';

test('opens the welcome message', async ({ page }) => {
  await page.goto('/welcome');

  await page.getByRole('button', { name: 'Start tour' }).click();

  await expect(page.getByText('Tour started')).toBeVisible();
});`,
    codeTips: {
      "import { test, expect } from '@playwright/test';":
        "`test` creates a Playwright test. `expect` checks that the page ended in the right state.",
      "test('opens the welcome message', async ({ page }) => {":
        "This names the test and gives you a `page` object, which represents the browser tab.",
      "await page.goto('/welcome');":
        "The demo is already visible here, but a real test opens /welcome from a fresh page.",
      "await page.getByRole('button', { name: 'Start tour' }).click();":
        "Find the button named Start tour, then click it. Role answers what it is; name answers which one.",
      "await expect(page.getByText('Tour started')).toBeVisible();":
        "After the click, verify the success text is visible. This is what makes it a real test."
    },
    initial: () => ({ clicked: false }),
    resultSteps: [
      { text: "Test opens /welcome", codeLine: "await page.goto('/welcome');" },
      {
        text: "Clicked Start tour",
        codeLine: "await page.getByRole('button', { name: 'Start tour' }).click();",
        apply: state => ({ ...state, clicked: true })
      },
      { text: "Found visible text: Tour started", codeLine: "await expect(page.getByText('Tour started')).toBeVisible();" }
    ],
    render: state => `
      <article class="demo-card portal-welcome-card">
        <div class="portal-demo-header">
          <span class="portal-demo-logo" aria-hidden="true">&lt;/&gt;</span>
          <strong>Playwright Lab</strong>
        </div>
        <h3>Welcome to the training portal</h3>
        <p>Practice the first automation step on the portal dashboard.</p>
        <div class="portal-stat-grid" aria-label="Playwright Lab training summary">
          <div>
            <strong>6</strong>
            <span>Lessons</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Modes</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Workflow</span>
          </div>
        </div>
        <div class="demo-actions">
          <button class="demo-button demo-tooltip-trigger ${state.clicked ? "is-complete" : ""}" type="button" data-action="start-tour">
            ${state.clicked ? "Tour started" : "Start tour"}
            <span class="demo-tooltip" id="start-tour-tip" role="tooltip" aria-hidden="true">
              ${state.clicked ? "New text is visible." : "Click to trigger getByRole()."}
            </span>
          </button>
          <button class="demo-button secondary" type="button" data-action="learn-more">Learn more</button>
        </div>
      </article>`,
    bind: surface => {
      surface.querySelector('[data-action="start-tour"]').addEventListener("click", () => {
        demoState.clicked = true;
        renderDemo();
        scheduleDemoResultReset();
      });
    },
    validate: state => state.clicked,
    hints: ["Visited /welcome", "Clicked Start tour", "Found visible text: Tour started"]
  },
  {
    title: "Fill the Form",
    short: "getByLabel",
    time: "8 min",
    summary:
      "Find labeled fields, fill login details, submit the form, and verify sign-in worked.",
    goal: "Fill fields by label and submit the form without depending on placeholder text.",
    userAction:
      "The user types a username and password in the portal sign-in screen, then clicks Sign in.",
    playwrightAction:
      "The code uses labels to find the inputs, fills them, then clicks the submit button.",
    successCheck:
      "First try the form manually. Then run the automation and watch it fill both fields, sign in, and verify Dashboard ready.",
    conceptTitle: "Why `getByLabel()`?",
    conceptBody: [
      { label: "Locator", value: "getByLabel()", note: "A locator that finds a form field through its visible label." },
      { label: "Label", value: "Username", note: "The visible label attached to the input." },
      { label: "Element", value: "username input", note: "The real field Playwright fills." },
      { label: "Action", value: "fill()", note: "Replaces the current input value." }
    ],
    conceptCode: "page.getByLabel('Username').fill('ari')",
    demoPath: "/login",
    demoTitle: "Portal login",
    tasks: [
      "Target inputs with `getByLabel()`.",
      "Fill realistic values into the username and password fields.",
      "Submit and assert the confirmation text."
    ],
    code: `import { test, expect } from '@playwright/test';

test('signs in to the portal', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Username').fill('ari');
  await page.getByLabel('Password').fill('playwright-demo');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Dashboard ready')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/login');":
        "A real test opens /login from a fresh page before filling the sign-in form.",
      "await page.getByLabel('Username').fill('ari');":
        "Find the input connected to the Username label. Labels are usually more stable than placeholder text.",
      "await page.getByLabel('Password').fill('playwright-demo');":
        "Find the password field by label and fill it with a demo value.",
      "await page.getByRole('button', { name: 'Sign in' }).click();":
        "Find the submit button by what the user sees, then click it.",
      "await expect(page.getByText('Dashboard ready')).toBeVisible();":
        "Check that the app confirms sign-in reached the portal dashboard."
    },
    initial: () => ({
      user: "",
      password: "",
      submitted: false,
      autoFilledUser: false,
      autoFilledPassword: false,
      invalidUser: false,
      invalidPassword: false
    }),
    resultSteps: [
      { text: "Test opens /login", codeLine: "await page.goto('/login');" },
      {
        text: "Filled Username",
        codeLine: "await page.getByLabel('Username').fill('ari');",
        apply: state => ({ ...state, user: "ari", activeField: "user", autoFilledUser: true })
      },
      {
        text: "Filled Password",
        codeLine: "await page.getByLabel('Password').fill('playwright-demo');",
        apply: state => ({ ...state, password: "playwright-demo", activeField: "password", autoFilledPassword: true })
      },
      {
        text: "Clicked Sign in",
        codeLine: "await page.getByRole('button', { name: 'Sign in' }).click();",
        apply: state => ({ ...state, submitted: Boolean(state.user && state.password), activeField: "" })
      },
      { text: "Found visible text: Dashboard ready", codeLine: "await expect(page.getByText('Dashboard ready')).toBeVisible();" }
    ],
    render: state => `
      <form class="demo-card portal-login-card" data-form="signin">
        <div class="portal-wordmark" aria-label="Playwright Lab">
          <span>&lt;/&gt;</span>
          <strong>Playwright <em>Lab</em></strong>
        </div>
        <span class="status-pill ${state.submitted ? "success" : state.invalidUser || state.invalidPassword ? "danger" : ""}">
          ${state.submitted ? "Dashboard ready" : state.invalidUser || state.invalidPassword ? "Missing details" : "Sign-in form"}
        </span>
        <h3>Sign in</h3>
        <p>Use the lesson account to continue to Playwright Lab.</p>
        <div class="demo-field ${state.activeField === "user" || state.autoFilledUser ? "is-auto-filled" : ""} ${state.invalidUser ? "is-invalid" : ""}">
          <label for="user">Username</label>
          <input id="user" name="user" value="${escapeHtml(state.user)}" autocomplete="username">
        </div>
        <div class="demo-field ${state.activeField === "password" || state.autoFilledPassword ? "is-auto-filled" : ""} ${state.invalidPassword ? "is-invalid" : ""}">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" value="${escapeHtml(state.password)}" autocomplete="current-password">
        </div>
        <div class="portal-login-actions">
            <button class="portal-link-button" type="button">Forgot username?</button>
          <button class="demo-button ${state.submitted ? "is-signed-in" : ""}" type="submit" data-action="submit-login">
            ${state.submitted ? "Signed in" : "Sign in"}
          </button>
        </div>
      </form>`,
    bind: surface => {
      const userInput = surface.querySelector("#user");
      const passwordInput = surface.querySelector("#password");
      const signInForm = surface.querySelector('[data-form="signin"]');

      userInput.addEventListener("input", event => {
        demoState.user = event.target.value;
        demoState.autoFilledUser = false;
        demoState.invalidUser = false;
      });
      passwordInput.addEventListener("input", event => {
        demoState.password = event.target.value;
        demoState.autoFilledPassword = false;
        demoState.invalidPassword = false;
      });
      signInForm.addEventListener("submit", event => {
        event.preventDefault();
        const missingUser = !demoState.user.trim();
        const missingPassword = !demoState.password.trim();
        demoState.submitted = !missingUser && !missingPassword;
        demoState.invalidUser = missingUser;
        demoState.invalidPassword = missingPassword;
        renderDemo();
        if (demoState.submitted) scheduleDemoResultReset();
      });
    },
    validate: state => state.submitted,
    hints: ["Filled Username", "Filled Password", "Clicked Sign in", "Found visible text: Dashboard ready"]
  },
  {
    title: "Find the Right Element",
    short: "role + name",
    time: "9 min",
    summary:
      "Find the exact button by role and name instead of relying on visual position.",
    goal: "Choose the Work training path by accessible button name and avoid depending on visual order.",
    userAction:
      "In the path picker, the user clicks Choose Work path. Any other path should show the wrong-selection state.",
    playwrightAction:
      "The code searches for a button named Choose Work path instead of clicking a card by position.",
    successCheck:
      "First choose a path manually. Then run the automation and watch it select Work by exact button name.",
    conceptTitle: "Role plus name beats position",
    conceptBody: [
      { label: "Locator", value: "getByRole()", note: "Finds elements by accessible meaning, not CSS position." },
      { label: "Role", value: "button", note: "Several controls share this type." },
      { label: "Name", value: "Choose Work path", note: "The exact button Playwright should pick." },
      { label: "Avoid", value: "position", note: "Do not rely on second card or visual order." }
    ],
    conceptCode: "page.getByRole('button', { name: 'Choose Work path' })",
    demoPath: "/plans",
    demoTitle: "Training path picker",
    tasks: [
      "Compare the repeated training path cards.",
      "Click the button whose name includes the path you want.",
      "Assert that the selected path appears in the status area."
    ],
    code: `import { test, expect } from '@playwright/test';

test('selects the work path', async ({ page }) => {
  await page.goto('/plans');

  await page
    .getByRole('button', { name: 'Choose Work path' })
    .click();

  await expect(page.getByText('Selected: Work')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/plans');":
        "A real test opens /plans from a fresh page.",
      ".getByRole('button', { name: 'Choose Work path' })":
        "Choose the button by its accessible role and exact visible name.",
      ".click();":
        "Click the locator found on the line above.",
      "await expect(page.getByText('Selected: Work')).toBeVisible();":
        "Confirm the app selected the intended path."
    },
    initial: () => ({ selected: "" }),
    resultSteps: [
      { text: "Test opens /plans", codeLine: "await page.goto('/plans');" },
      { text: "Located Choose Work path button", codeLine: ".getByRole('button', { name: 'Choose Work path' })" },
      {
        text: "Clicked the selected locator",
        codeLine: ".click();",
        apply: state => ({ ...state, selected: "Work" })
      },
      { text: "Found visible text: Selected: Work", codeLine: "await expect(page.getByText('Selected: Work')).toBeVisible();" }
    ],
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.selected === "Work" ? "success" : state.selected ? "danger" : ""}">
          ${state.selected ? (state.selected === "Work" ? "Selected: Work" : "Wrong path selected") : "No path selected"}
        </span>
        <h3>Choose a training path</h3>
        ${state.selected && state.selected !== "Work" ? `<p class="selection-feedback">Expected: Work. Actual: ${escapeHtml(state.selected)}.</p>` : ""}
        <div class="product-grid">
          ${[
            ["Home", "Practice small personal workflows"],
            ["School", "Learn with classroom examples"],
            ["Work", "Best for professional QA practice"],
            ["Team", "Coordinate shared automation habits"]
          ].map(([path, note]) => `
            <div class="product ${state.selected === path ? (path === "Work" ? "is-correct" : "is-wrong") : ""}">
              <strong>${path}</strong>
              <span>${note}</span>
              <button class="demo-button secondary" data-plan="${path}">Choose ${path} path</button>
            </div>
          `).join("")}
        </div>
      </article>`,
    bind: surface => {
      surface.querySelectorAll("[data-plan]").forEach(button => {
        button.addEventListener("click", () => {
          demoState.selected = button.dataset.plan;
          renderDemo();
        });
      });
    },
    validate: state => state.selected === "Work",
    hints: ["Located button by role", "Clicked Choose Work path", "Found visible text: Selected: Work"]
  },
  {
    title: "Check the Result",
    short: "expect",
    time: "7 min",
    summary:
      "Add two practice exercises, read the visible result, and assert the exact text users see.",
    goal: "Use `expect(locator).toHaveText()` to verify the session count reaches the expected value.",
    userAction:
      "The user adds locator practice and assertion practice to today's session.",
    playwrightAction:
      "The code clicks both exercise buttons, then checks the session-count element text.",
    successCheck:
      "First add exercises manually. Then run pass and fail scenarios to compare 2 exercises with 1 exercise.",
    conceptTitle: "Assertions prove the result",
    conceptBody: [
      { label: "Locator", value: "session-count", note: "The badge the test reads." },
      { label: "Assertion", value: "toHaveText()", note: "An assertion checks that the app reached the expected result." },
      { label: "Expected", value: "2 exercises", note: "The exact text users should see." }
    ],
    conceptCode: "expect(page.getByTestId('session-count')).toHaveText('2 exercises')",
    demoPath: "/session",
    demoTitle: "Session builder",
    tasks: [
      "Add two practice exercises to the session.",
      "Read the session count from the visible badge.",
      "Assert the exact text that users see."
    ],
    codeTips: {
      "await page.goto('/session');":
        "A real test opens /session from a fresh page.",
      "await page.getByRole('button', { name: 'Add locator practice' }).click();":
        "Add the first required exercise to the session.",
      "await page.getByRole('button', { name: 'Add assertion practice' }).click();":
        "Add the second required exercise so the session has two exercises.",
      "await expect(page.getByTestId('session-count')).toHaveText('2 exercises');":
        "`toHaveText` waits until the session badge says exactly 2 exercises. If only one exercise was added, this fails."
    },
    scenarios: {
      pass: {
        code: `import { test, expect } from '@playwright/test';

test('builds a practice session', async ({ page }) => {
  await page.goto('/session');

  await page.getByRole('button', { name: 'Add locator practice' }).click();
  await page.getByRole('button', { name: 'Add assertion practice' }).click();

  await expect(page.getByTestId('session-count')).toHaveText('2 exercises');
});`,
        resultSteps: [
          { text: "Test opens /session", codeLine: "await page.goto('/session');" },
          {
            text: "Clicked Add locator practice",
            codeLine: "await page.getByRole('button', { name: 'Add locator practice' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedLocator: true })
          },
          {
            text: "Clicked Add assertion practice",
            codeLine: "await page.getByRole('button', { name: 'Add assertion practice' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedAssertion: true })
          },
          { text: "Expected session count: 2 exercises", codeLine: "await expect(page.getByTestId('session-count')).toHaveText('2 exercises');" }
        ],
        validate: state => state.count === 2
      },
      fail: {
        code: `import { test, expect } from '@playwright/test';

test('builds a practice session', async ({ page }) => {
  await page.goto('/session');

  await page.getByRole('button', { name: 'Add locator practice' }).click();

  await expect(page.getByTestId('session-count')).toHaveText('2 exercises');
});`,
        resultSteps: [
          { text: "Test opens /session", codeLine: "await page.goto('/session');" },
          {
            text: "Clicked Add locator practice",
            codeLine: "await page.getByRole('button', { name: 'Add locator practice' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedLocator: true })
          },
          { text: "Expected 2 exercises, found 1 exercise", codeLine: "await expect(page.getByTestId('session-count')).toHaveText('2 exercises');" }
        ],
        validate: state => state.count === 2
      }
    },
    initial: () => ({ count: 0 }),
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.count ? "success" : ""}" data-testid="session-count">
          ${state.count} ${state.count === 1 ? "exercise" : "exercises"}
        </span>
        <h3>Build today's practice session</h3>
        <p>Add exactly two exercises. One exercise is not enough for this assertion.</p>
        <div class="session-exercises">
          <button class="demo-button" data-action="add-locator" ${state.addedLocator || state.count >= 2 ? "disabled" : ""}>Add locator practice</button>
          <button class="demo-button secondary" data-action="add-assertion" ${state.addedAssertion || state.count >= 2 ? "disabled" : ""}>Add assertion practice</button>
          <button class="demo-button secondary" data-action="add-debug" ${state.addedDebug || state.count >= 2 ? "disabled" : ""}>Add debug practice</button>
        </div>
      </article>`,
    bind: surface => {
      surface.querySelector('[data-action="add-locator"]').addEventListener("click", () => {
        if (demoState.addedLocator || demoState.count >= 2) return;
        demoState.addedLocator = true;
        demoState.count += 1;
        renderDemo();
      });
      surface.querySelector('[data-action="add-assertion"]').addEventListener("click", () => {
        if (demoState.addedAssertion || demoState.count >= 2) return;
        demoState.addedAssertion = true;
        demoState.count += 1;
        renderDemo();
      });
      surface.querySelector('[data-action="add-debug"]').addEventListener("click", () => {
        if (demoState.addedDebug || demoState.count >= 2) return;
        demoState.addedDebug = true;
        demoState.count += 1;
        renderDemo();
      });
    },
    hints: ["Clicked Add locator practice", "Clicked Add assertion practice", "Read data-testid session-count", "Expected text: 2 exercises"]
  },
  {
    title: "Wait for UI Changes",
    short: "auto-wait",
    time: "10 min",
    summary:
      "Click a delayed action and let Playwright wait until the final result appears.",
    goal: "Let Playwright wait for the final visible state instead of adding manual timeouts.",
    userAction:
      "The user clicks Generate progress report and waits until the status changes from Generating to Report ready.",
    playwrightAction:
      "The code clicks the button and lets Playwright wait for the final text to become visible.",
    successCheck:
      "First generate the report manually. Then run the automation and watch Playwright wait until Report ready appears.",
    conceptTitle: "Playwright waits like a patient user",
    conceptBody: [
      { label: "Action", value: "Generate progress report", note: "Starts a delayed UI change." },
      { label: "Wait", value: "auto-wait", note: "Playwright waits through the loading state." },
      { label: "Assertion", value: "toBeVisible()", note: "Checks that the final visible text appears." },
      { label: "Result", value: "Report ready", note: "The final visible text to verify." }
    ],
    conceptCode: "expect(page.getByText('Report ready')).toBeVisible()",
    demoPath: "/reports",
    demoTitle: "Progress report",
    tasks: [
      "Click the button that starts loading.",
      "Notice the temporary loading state.",
      "Assert the completed report text."
    ],
    code: `import { test, expect } from '@playwright/test';

test('generates the progress report', async ({ page }) => {
  await page.goto('/reports');

  await page.getByRole('button', { name: 'Generate progress report' }).click();

  await expect(page.getByText('Report ready')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/reports');":
        "A real test opens /reports from a fresh page.",
      "await page.getByRole('button', { name: 'Generate progress report' }).click();":
        "Start the async progress report generation.",
      "await expect(page.getByText('Report ready')).toBeVisible();":
        "Wait for the final visible message instead of using a fixed timeout."
    },
    initial: () => ({ status: "idle" }),
    resultSteps: [
      { text: "Test opens /reports", codeLine: "await page.goto('/reports');" },
      {
        text: "Clicked Generate progress report",
        codeLine: "await page.getByRole('button', { name: 'Generate progress report' }).click();",
        apply: state => ({ ...state, status: "loading" })
      },
      {
        text: "Waited for Report ready",
        codeLine: "await expect(page.getByText('Report ready')).toBeVisible();",
        apply: state => ({ ...state, status: "ready" })
      }
    ],
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.status === "ready" ? "success" : ""}">
          ${state.status === "ready" ? "Report ready" : state.status === "loading" ? "Generating" : "Idle"}
        </span>
        <h3>Training progress report</h3>
        <p>The portal needs a moment before the final report state appears.</p>
        <button class="demo-button" data-action="generate" ${state.status === "loading" ? "disabled" : ""}>
          Generate progress report
        </button>
      </article>`,
    bind: surface => {
      const button = surface.querySelector('[data-action="generate"]');
      if (!button) return;
      button.addEventListener("click", () => {
        demoState.status = "loading";
        renderDemo();
        window.setTimeout(() => {
          demoState.status = "ready";
          renderDemo();
        }, 900);
      });
    },
    validate: state => state.status === "ready",
    hints: ["Clicked Generate progress report", "Waited for visible final state", "Found visible text: Report ready"]
  },
  {
    title: "Debug a Broken Test",
    short: "debugging",
    time: "12 min",
    summary:
      "Read the failed state, add the missing action, and verify the fixed result.",
    goal: "Use the runner output to spot the missing action and fix the scenario.",
    userAction:
      "The user first presses Run test to see the missing state. Then the user clicks Enable progress alerts and runs it again.",
    playwrightAction:
      "The code performs the missing click and expects the enabled message to appear.",
    successCheck:
      "First notice the off state manually. Then run the automation and watch the missing setup click enable Progress alerts.",
    conceptTitle: "Debugging means reading the missing state",
    conceptBody: [
      { label: "Failure clue", value: "text missing", note: "The expected result did not appear." },
      { label: "Locator", value: "getByRole()", note: "Finds the missing setup button by role and name." },
      { label: "Missing action", value: "click alerts", note: "The test must enable the portal setting first." },
      { label: "Assertion", value: "toBeVisible()", note: "Confirms the enabled message appears." }
    ],
    conceptCode: "expect(page.getByText('Progress alerts enabled')).toBeVisible()",
    demoPath: "/settings",
    demoTitle: "Portal settings",
    tasks: [
      "Try running the test before enabling notifications.",
      "Turn on the setting in the demo app.",
      "Run again and read the passing log."
    ],
    code: `import { test, expect } from '@playwright/test';

test('enables progress notifications', async ({ page }) => {
  await page.goto('/settings');

  await page
    .getByRole('button', { name: 'Enable progress alerts' })
    .click();

  await expect(page.getByText('Progress alerts enabled')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/settings');":
        "A real test opens /settings from a fresh page.",
      ".getByRole('button', { name: 'Enable progress alerts' })":
        "Find the exact settings button by role and name.",
      ".click();":
        "Perform the missing action.",
      "await expect(page.getByText('Progress alerts enabled')).toBeVisible();":
        "Confirm the enabled message appears."
    },
    initial: () => ({ enabled: false }),
    resultSteps: [
      { text: "Test opens /settings", codeLine: "await page.goto('/settings');" },
      { text: "Located Enable progress alerts button", codeLine: ".getByRole('button', { name: 'Enable progress alerts' })" },
      {
        text: "Clicked the selected locator",
        codeLine: ".click();",
        apply: state => ({ ...state, enabled: true })
      },
      { text: "Found visible text: Progress alerts enabled", codeLine: "await expect(page.getByText('Progress alerts enabled')).toBeVisible();" }
    ],
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.enabled ? "success" : ""}">
          ${state.enabled ? "Progress alerts enabled" : "Progress alerts off"}
        </span>
        <h3>Portal settings</h3>
        <p>Use this screen to practice reading a failing test and fixing the portal state.</p>
        <button class="demo-button" data-action="enable-alerts">Enable progress alerts</button>
        ${state.enabled ? '<div class="toast">Progress alerts enabled</div>' : ""}
      </article>`,
    bind: surface => {
      surface.querySelector('[data-action="enable-alerts"]').addEventListener("click", () => {
        demoState.enabled = true;
        renderDemo();
      });
    },
    validate: state => state.enabled,
    hints: ["Clicked Enable progress alerts", "Found toast text", "Trace would show the completed action"]
  }
];

let activeLessonIndex = 0;
let demoState = lessons[0].initial();
let runAnimationId = 0;
let demoResultResetTimer = 0;
let lesson4Scenario = "fail";

const lessonList = document.querySelector("#lesson-list");
const lessonStep = document.querySelector("#lesson-step");
const lessonTime = document.querySelector("#lesson-time");
const lessonTitle = document.querySelector("#lesson-title");
const lessonSubtitle = document.querySelector("#lesson-subtitle");
const lessonSummary = document.querySelector("#lesson-summary");
const lessonGoal = document.querySelector("#lesson-goal");
const userAction = document.querySelector("#user-action");
const playwrightAction = document.querySelector("#playwright-action");
const successCheck = document.querySelector("#success-check");
const conceptTitle = document.querySelector("#concept-title");
const conceptBody = document.querySelector("#concept-body");
const taskList = document.querySelector("#task-list");
const demoTitle = document.querySelector("#demo-title");
const demoSubtitle = document.querySelector("#demo-subtitle");
const demoAddress = document.querySelector("#demo-address");
const demoSurface = document.querySelector("#demo-surface");
const codeTitle = document.querySelector("#code-title");
const codeSubtitle = document.querySelector("#code-subtitle");
const codeExample = document.querySelector("#code-example");
const runnerStatus = document.querySelector("#runner-status");
const runnerLog = document.querySelector("#runner-log");
const runTestButton = document.querySelector("#run-test");
const scenarioToggle = document.querySelector("#scenario-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const automationCursor = document.querySelector("#automation-cursor");
const pageScrollbar = document.querySelector("#page-scrollbar");
const pageScrollbarThumb = document.querySelector("#page-scrollbar-thumb");

let exampleAnimationId = 0;
let exampleRunning = false;
let examplePaused = false;

const storedTheme = localStorage.getItem("playwright-lab-theme");
const initialTheme = storedTheme === "light" ? "light" : "dark";

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggleLabel.textContent = isDark ? "Dark mode" : "Light mode";
  localStorage.setItem("playwright-lab-theme", theme);
}

applyTheme(initialTheme);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function highlightCodeLine(line) {
  return escapeHtml(line)
    .replace(
      /(&#039;[^&]*?&#039;)/g,
      '<span class="token-string">$1</span>'
    )
    .replace(
      /\b(import|from|test|async|await|const|let|return)\b/g,
      '<span class="token-keyword">$1</span>'
    )
    .replace(
      /\b(page|expect|locator|teamCards)\b/g,
      '<span class="token-object">$1</span>'
    )
    .replace(
      /\.(goto|getByRole|getByText|getByLabel|getByTestId|click|fill|toBeVisible|toHaveText|selectOption)\b/g,
      '.<span class="token-method">$1</span>'
    );
}

function renderConceptBody(content) {
  if (Array.isArray(content)) {
    return `
      <div class="concept-grid">
        ${content
          .map(item => `
            <div class="concept-chip">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
              <p>${escapeHtml(item.note)}</p>
            </div>
          `)
          .join("")}
      </div>
    `;
  }

  return `<p>${escapeHtml(content)}</p>`;
}

function getConceptDisplayName(lesson) {
  const labels = {
    getByRole: "getByRole()",
    getByLabel: "getByLabel()",
    "role + name": "getByRole({ name })",
    expect: "expect()",
    "auto-wait": "Auto-wait",
    debugging: "Debugging"
  };

  return labels[lesson.short] || lesson.short;
}

function getTechniqueLabel(lesson) {
  const labels = {
    getByRole: "Using locators",
    getByLabel: "Using locators",
    "role + name": "Using locators",
    expect: "Using assertions",
    "auto-wait": "Using auto-wait",
    debugging: "Using locators and assertions"
  };

  return labels[lesson.short] || "Using Playwright";
}

function getConceptType(lesson) {
  const labels = {
    getByRole: "Locator",
    getByLabel: "Locator",
    "role + name": "Locator",
    expect: "Assertion",
    "auto-wait": "Auto-wait",
    debugging: "Debugging"
  };

  return labels[lesson.short] || "Concept";
}

function getConceptSubtitle(lesson) {
  const conceptName = getConceptDisplayName(lesson);
  const labels = {
    "auto-wait": "Built-in waiting",
    debugging: "Trace and runner output"
  };

  return labels[lesson.short] || conceptName;
}

function getCodePanelTitle(lesson) {
  const conceptName = getConceptDisplayName(lesson);
  const labels = {
    getByRole: `${conceptName} locator`,
    getByLabel: `${conceptName} locator`,
    "role + name": `${conceptName} locator`,
    expect: `${conceptName} assertion`,
    "auto-wait": "Auto-wait behavior",
    debugging: "Debugging workflow"
  };

  return labels[lesson.short] || conceptName;
}

function renderCodeWithTips(code, tips) {
  const lines = code
    .split("\n")
    .map((line, index) => {
      const tip = tips[line.trim()];
      const lineNumber = String(index + 1).padStart(2, "0");
      const hasTip = Boolean(tip);

      return `
        <div class="code-line ${hasTip ? "has-tip" : ""}" data-code-key="${escapeHtml(line.trim())}" ${hasTip ? `data-tip="${escapeHtml(tip)}"` : ""}>
          <span class="line-number">${lineNumber}</span>
          <code>${highlightCodeLine(line) || " "}</code>
        </div>
      `;
    })
    .join("");

  return lines;
}

function getLessonRunnerSteps(lesson) {
  return lesson.scenarios ? lesson.scenarios[lesson4Scenario].resultSteps : lesson.resultSteps;
}

function getLessonValidation(lesson) {
  return lesson.scenarios ? lesson.scenarios[lesson4Scenario].validate : lesson.validate;
}

function getLessonCode(lesson) {
  return lesson.scenarios ? lesson.scenarios[lesson4Scenario].code : lesson.code;
}

function setLesson(index) {
  activeLessonIndex = index;
  if (index === 3 && !exampleRunning) {
    lesson4Scenario = "fail";
  }
  demoState = lessons[index].initial();
  renderLesson();
  renderDemo();
  resetRunner();
}

function renderLessonList() {
  const exampleButton = `
    <div class="lesson-button example-button" id="example-button" aria-label="Automated preview controls">
      <span>
        <strong>Example</strong>
        <span>Automated preview</span>
      </span>
      <span class="example-controls" aria-label="Automated preview controls">
        <button class="example-control" id="example-play" type="button" aria-label="${exampleRunning && examplePaused ? "Resume automated preview" : "Start automated preview"}" ${exampleRunning && !examplePaused ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m8 5 11 7-11 7V5Z"></path>
          </svg>
        </button>
        <button class="example-control" id="example-pause" type="button" aria-label="Pause automated preview" ${!exampleRunning || examplePaused ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14"></path>
            <path d="M16 5v14"></path>
          </svg>
        </button>
        <button class="example-control" id="example-stop" type="button" aria-label="Stop automated preview" ${!exampleRunning ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h10v10H7z"></path>
          </svg>
        </button>
      </span>
    </div>
  `;

  lessonList.innerHTML = exampleButton + lessons
    .map((lesson, index) => `
      <button class="lesson-button" type="button" data-lesson="${index}" ${index === activeLessonIndex ? 'aria-current="step"' : ""}>
        <span class="lesson-number">${index + 1}</span>
        <span>
          <strong>${lesson.title}</strong>
          <span>${lesson.short}</span>
        </span>
      </button>
    `)
    .join("");

  lessonList.querySelectorAll("[data-lesson]").forEach(button => {
    button.addEventListener("click", () => setLesson(Number(button.dataset.lesson)));
  });

  document.querySelector("#example-play").addEventListener("click", () => {
    if (exampleRunning && examplePaused) {
      resumeExampleAutomation();
      return;
    }
    runExampleAutomation();
  });

  document.querySelector("#example-pause").addEventListener("click", pauseExampleAutomation);
  document.querySelector("#example-stop").addEventListener("click", () => {
    stopExampleAutomation();
  });
}

function renderLesson() {
  const lesson = lessons[activeLessonIndex];
  const conceptName = getConceptDisplayName(lesson);
  const techniqueLabel = getTechniqueLabel(lesson);
  const conceptType = getConceptType(lesson);
  const conceptSubtitle = getConceptSubtitle(lesson);
  const learningTitle = `${lesson.title} - ${techniqueLabel}`;

  renderLessonList();
  lessonStep.textContent = `Step ${activeLessonIndex + 1} of ${lessons.length}`;
  lessonTime.textContent = lesson.time;
  lessonTitle.textContent = lesson.title;
  lessonSubtitle.textContent = `${conceptType}: ${conceptSubtitle}`;
  lessonSummary.textContent = lesson.summary;
  lessonGoal.textContent = lesson.goal;
  userAction.textContent = lesson.userAction;
  playwrightAction.textContent = lesson.playwrightAction;
  successCheck.textContent = lesson.successCheck;
  conceptTitle.textContent = lesson.conceptCode;
  conceptBody.innerHTML = renderConceptBody(lesson.conceptBody);
  demoTitle.textContent = lesson.title;
  demoSubtitle.textContent = `${techniqueLabel} - ${conceptType}: ${conceptSubtitle}`;
  demoAddress.textContent = `https://demo.playwright-lab.test${lesson.demoPath}`;
  codeTitle.textContent = "Automation code";
  codeSubtitle.textContent = `${getCodePanelTitle(lesson)} for ${lesson.title}`;
  scenarioToggle.hidden = !lesson.scenarios;
  if (lesson.scenarios) {
    scenarioToggle.querySelectorAll("[data-scenario]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.scenario === lesson4Scenario));
    });
  }
  codeExample.innerHTML = renderCodeWithTips(getLessonCode(lesson), lesson.codeTips || {});

  taskList.innerHTML = lesson.tasks
    .map((task, index) => `
      <li>
        <span class="task-index">${index + 1}</span>
        <span>${task}</span>
      </li>
    `)
    .join("");
}

function renderRunnerSteps() {
  const lesson = lessons[activeLessonIndex];
  runnerLog.innerHTML = getLessonRunnerSteps(lesson)
    .map((step, index) => `
      <li>
        <button class="result-step" type="button" data-result-index="${index}">
          <span>${index + 1}</span>
          <strong>${escapeHtml(step.text)}</strong>
        </button>
      </li>
    `)
    .join("");

  runnerLog.querySelectorAll("[data-result-index]").forEach(button => {
    button.addEventListener("click", () => {
      highlightTraceStep(Number(button.dataset.resultIndex), "manual");
    });
  });
}

function clearTraceHighlights() {
  runnerLog.querySelectorAll(".result-step").forEach(step => {
    step.classList.remove("is-active", "is-complete");
  });
  codeExample.querySelectorAll(".code-line").forEach(line => {
    line.classList.remove("is-trace-active", "is-trace-complete");
  });
}

function findCodeLineByKey(codeLine) {
  return Array.from(codeExample.querySelectorAll(".code-line")).find(
    line => line.dataset.codeKey === codeLine
  );
}

function highlightTraceStep(index, mode = "active") {
  const lesson = lessons[activeLessonIndex];
  const step = getLessonRunnerSteps(lesson)[index];
  if (!step) return;

  clearTraceHighlights();

  runnerLog.querySelectorAll(".result-step").forEach((resultStep, resultIndex) => {
    if (mode === "complete" && resultIndex <= index) {
      resultStep.classList.add("is-complete");
    }
    if (resultIndex === index) {
      resultStep.classList.add("is-active");
    }
  });

  const codeLine = findCodeLineByKey(step.codeLine);
  if (codeLine) {
    codeLine.classList.add("is-trace-active");
    codeLine.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function sleep(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function sleepWithExamplePause(ms, runAnimation) {
  if (!exampleRunning) {
    await sleep(ms);
    return runAnimationId === runAnimation;
  }

  let elapsed = 0;
  const interval = 100;
  while (elapsed < ms) {
    if (runAnimationId !== runAnimation) return false;
    if (examplePaused) {
      await sleep(interval);
      continue;
    }
    const step = Math.min(interval, ms - elapsed);
    await sleep(step);
    elapsed += step;
  }

  return runAnimationId === runAnimation;
}

function updatePageScrollbar() {
  const scrollContainer = document.querySelector(".workspace");
  const scrollable = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  if (scrollable <= 0) {
    pageScrollbar.classList.add("is-hidden");
    return;
  }

  pageScrollbar.classList.remove("is-hidden");
  const trackHeight = pageScrollbar.getBoundingClientRect().height;
  const thumbHeight = Math.max(44, (scrollContainer.clientHeight / scrollContainer.scrollHeight) * trackHeight);
  const maxThumbTravel = trackHeight - thumbHeight;
  const scrollProgress = scrollContainer.scrollTop / scrollable;
  pageScrollbarThumb.style.height = `${thumbHeight}px`;
  pageScrollbarThumb.style.transform = `translateY(${maxThumbTravel * scrollProgress}px)`;
}

function scrollElementBy(element, amount, axis = "top") {
  const property = axis === "left" ? "scrollLeft" : "scrollTop";
  const previousValue = element[property];
  element[property] += amount;
  return element[property] !== previousValue;
}

function handlePageWheel(event) {
  if (event.ctrlKey || Math.abs(event.deltaY) < 1) return;

  const target = event.target instanceof Element ? event.target : null;
  const sidebar = target?.closest(".sidebar");
  if (sidebar && sidebar.scrollHeight > sidebar.clientHeight && scrollElementBy(sidebar, event.deltaY)) {
    event.preventDefault();
    return;
  }

  const workspace = document.querySelector(".workspace");
  const shouldScrollHorizontally = event.shiftKey && workspace.scrollWidth > workspace.clientWidth;
  if (shouldScrollHorizontally && scrollElementBy(workspace, event.deltaY, "left")) {
    event.preventDefault();
    updatePageScrollbar();
    return;
  }

  if (workspace.scrollHeight > workspace.clientHeight && scrollElementBy(workspace, event.deltaY)) {
    event.preventDefault();
    updatePageScrollbar();
  }
}

function renderDemo() {
  const lesson = lessons[activeLessonIndex];
  demoSurface.innerHTML = lesson.render(demoState);
  lesson.bind(demoSurface);
  updatePageScrollbar();
}

function clearDemoResultReset() {
  window.clearTimeout(demoResultResetTimer);
  demoResultResetTimer = 0;
}

function resetTemporaryDemoResult() {
  if (demoState.clicked) {
    demoState = { ...demoState, clicked: false };
    renderDemo();
    return;
  }

  if (demoState.submitted) {
    demoState = "user" in demoState && "password" in demoState
      ? lessons[activeLessonIndex].initial()
      : { ...demoState, submitted: false };
    renderDemo();
  }
}

function scheduleDemoResultReset() {
  clearDemoResultReset();
  demoResultResetTimer = window.setTimeout(resetTemporaryDemoResult, 2000);
}

function resetRunner() {
  runAnimationId += 1;
  clearDemoResultReset();
  runnerStatus.textContent = "Not run";
  runnerStatus.className = "";
  runTestButton.disabled = false;
  renderRunnerSteps();
  clearTraceHighlights();
}

async function runTest() {
  const lesson = lessons[activeLessonIndex];
  const animationId = runAnimationId + 1;
  runAnimationId = animationId;

  demoState = lesson.initial();
  renderDemo();
  renderRunnerSteps();
  clearTraceHighlights();

  runnerStatus.textContent = "Running";
  runnerStatus.className = "";
  runTestButton.disabled = true;

  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 300 : 1600;

  const steps = getLessonRunnerSteps(lesson);

  for (let index = 0; index < steps.length; index += 1) {
    if (!await sleepWithExamplePause(0, animationId)) return;
    if (runAnimationId !== animationId) return;
    const step = steps[index];
    if (step.apply) {
      demoState = step.apply(demoState);
      renderDemo();
    }
    highlightTraceStep(index, "complete");
    if (!await sleepWithExamplePause(delay, animationId)) return;
  }

  if (runAnimationId !== animationId) return;
  const passed = getLessonValidation(lesson)(demoState);
  runnerLog.querySelectorAll(".result-step").forEach(step => {
    step.classList.add("is-complete");
    step.classList.remove("is-active");
  });
  codeExample.querySelectorAll(".code-line").forEach(line => {
    line.classList.remove("is-trace-active");
  });
  runnerStatus.textContent = passed ? "Passed" : "Needs action";
  runnerStatus.className = passed ? "pass" : "fail";
  runTestButton.disabled = false;
  if (passed) scheduleDemoResultReset();
}

function moveAutomationCursorTo(target) {
  const rect = target.getBoundingClientRect();
  document.documentElement.style.setProperty(
    "--automation-cursor-x",
    `${rect.left + rect.width * 0.54}px`
  );
  document.documentElement.style.setProperty(
    "--automation-cursor-y",
    `${rect.top + rect.height * 0.58}px`
  );
}

function showAutomationClickPulse(target) {
  const rect = target.getBoundingClientRect();
  const pulse = document.createElement("span");
  pulse.className = "automation-click-pulse";
  pulse.style.setProperty("--automation-pulse-x", `${rect.left + rect.width * 0.5}px`);
  pulse.style.setProperty("--automation-pulse-y", `${rect.top + rect.height * 0.5}px`);
  document.body.append(pulse);
  window.setTimeout(() => pulse.remove(), 460);
}

async function automationClick(target, animationId) {
  if (!await waitWhileExamplePaused(animationId)) return false;
  if (exampleAnimationId !== animationId) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  await sleep(300);
  if (!await waitWhileExamplePaused(animationId)) return false;
  if (exampleAnimationId !== animationId) return false;
  moveAutomationCursorTo(target);
  await sleep(1000);
  if (!await waitWhileExamplePaused(animationId)) return false;
  if (exampleAnimationId !== animationId) return false;
  automationCursor.classList.add("is-clicking");
  target.classList.add("is-auto-clicking");
  showAutomationClickPulse(target);
  target.click();
  await sleep(180);
  automationCursor.classList.remove("is-clicking");
  await sleep(220);
  target.classList.remove("is-auto-clicking");
  await sleep(230);
  return exampleAnimationId === animationId;
}

async function waitWhileExamplePaused(animationId) {
  while (exampleAnimationId === animationId && examplePaused) {
    await sleep(150);
  }
  return exampleAnimationId === animationId;
}

function pauseExampleAutomation() {
  if (!exampleRunning) return;
  examplePaused = true;
  automationCursor.classList.remove("is-clicking");
  renderLessonList();
}

function resumeExampleAutomation() {
  if (!exampleRunning) return;
  examplePaused = false;
  renderLessonList();
}

function stopExampleAutomation({ preserveRunner = false } = {}) {
  exampleAnimationId += 1;
  exampleRunning = false;
  examplePaused = false;
  automationCursor.classList.remove("is-visible", "is-clicking");
  if (preserveRunner) {
    runTestButton.disabled = false;
  } else {
    resetRunner();
  }
  renderLessonList();
}

async function waitForRunnerPassed(animationId) {
  while (exampleAnimationId === animationId && runnerStatus.textContent !== "Passed") {
    if (!await waitWhileExamplePaused(animationId)) return false;
    await sleep(200);
  }
  return exampleAnimationId === animationId;
}

async function runExampleAutomation() {
  const animationId = exampleAnimationId + 1;
  exampleAnimationId = animationId;
  exampleRunning = true;
  examplePaused = false;
  renderLessonList();
  automationCursor.classList.add("is-visible");

  for (let index = 0; index < lessons.length; index += 1) {
    if (!await waitWhileExamplePaused(animationId)) return;
    if (exampleAnimationId !== animationId) return;
    if (index === 3) {
      lesson4Scenario = "pass";
    }
    const lessonButton = lessonList.querySelector(`[data-lesson="${index}"]`);
    if (!await automationClick(lessonButton, animationId)) return;

    await sleep(350);
    if (!await waitWhileExamplePaused(animationId)) return;
    if (exampleAnimationId !== animationId) return;
    if (!await automationClick(runTestButton, animationId)) return;
    if (!await waitForRunnerPassed(animationId)) return;

    await sleep(650);
  }

  if (exampleAnimationId !== animationId) return;
  stopExampleAutomation({ preserveRunner: true });
}

document.querySelector("#reset-demo").addEventListener("click", () => {
  demoState = lessons[activeLessonIndex].initial();
  renderDemo();
  resetRunner();
});

runTestButton.addEventListener("click", runTest);

scenarioToggle.querySelectorAll("[data-scenario]").forEach(button => {
  button.addEventListener("click", () => {
    lesson4Scenario = button.dataset.scenario;
    demoState = lessons[activeLessonIndex].initial();
    renderLesson();
    renderDemo();
    resetRunner();
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

renderLesson();
renderDemo();
resetRunner();
updatePageScrollbar();

window.addEventListener("scroll", updatePageScrollbar, { passive: true });
document.querySelector(".workspace").addEventListener("scroll", updatePageScrollbar, { passive: true });
document.addEventListener("wheel", handlePageWheel, { passive: false });
window.addEventListener("resize", updatePageScrollbar);
