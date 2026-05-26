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
      "After the user clicks Start tour, press Run test. The result should say Passed.",
    conceptTitle: "Why `page.getByRole()`?",
    conceptBody: [
      { label: "Role", value: "button", note: "The accessibility type Playwright searches for." },
      { label: "Name", value: "Start tour", note: "The visible name that chooses the exact button." },
      { label: "Element", value: "the actual button", note: "The real control Playwright finds and clicks." }
    ],
    conceptCode: "page.getByRole('button', { name: 'Start tour' })",
    demoPath: "/welcome",
    demoTitle: "NBA statistics lab",
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
      <article class="demo-card nba-demo-card">
        <div class="nba-demo-header">
          <img class="nba-logo" src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NBA_script.svg" alt="NBA logo">
        </div>
        <h3>Welcome to NBA statistics lab</h3>
        <p>Practice the first automation step on a compact stats dashboard.</p>
        <div class="nba-stat-grid" aria-label="NBA sample statistics">
          <div>
            <strong>112.4</strong>
            <span>PPG</span>
          </div>
          <div>
            <strong>48.1</strong>
            <span>FG%</span>
          </div>
          <div>
            <strong>24</strong>
            <span>Teams tracked</span>
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
      "The user types a username and password in the Gmail-style sign-in screen, then clicks Sign in.",
    playwrightAction:
      "The code uses labels to find the inputs, fills them, then clicks the submit button.",
    successCheck:
      "Run test should pass when the status says Inbox ready.",
    conceptTitle: "Why `getByLabel()`?",
    conceptBody: [
      { label: "Label", value: "Username", note: "The visible label attached to the input." },
      { label: "Element", value: "username input", note: "The real field Playwright fills." },
      { label: "Action", value: "fill()", note: "Replaces the current input value." }
    ],
    conceptCode: "page.getByLabel('Username').fill('ari')",
    demoPath: "/login",
    demoTitle: "Gmail-style login",
    tasks: [
      "Target inputs with `getByLabel()`.",
      "Fill realistic values into the username and password fields.",
      "Submit and assert the confirmation text."
    ],
    code: `import { test, expect } from '@playwright/test';

test('signs in to mail', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Username').fill('ari');
  await page.getByLabel('Password').fill('playwright-demo');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Inbox ready')).toBeVisible();
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
      "await expect(page.getByText('Inbox ready')).toBeVisible();":
        "Check that the app confirms sign-in reached the inbox state."
    },
    initial: () => ({ user: "", password: "", submitted: false }),
    resultSteps: [
      { text: "Test opens /login", codeLine: "await page.goto('/login');" },
      {
        text: "Filled Username",
        codeLine: "await page.getByLabel('Username').fill('ari');",
        apply: state => ({ ...state, user: "ari" })
      },
      {
        text: "Filled Password",
        codeLine: "await page.getByLabel('Password').fill('playwright-demo');",
        apply: state => ({ ...state, password: "playwright-demo" })
      },
      {
        text: "Clicked Sign in",
        codeLine: "await page.getByRole('button', { name: 'Sign in' }).click();",
        apply: state => ({ ...state, submitted: Boolean(state.user && state.password) })
      },
      { text: "Found visible text: Inbox ready", codeLine: "await expect(page.getByText('Inbox ready')).toBeVisible();" }
    ],
    render: state => `
      <form class="demo-card gmail-login-card" data-form="signin">
        <div class="gmail-wordmark" aria-label="Gmail">
          <span>G</span><span>m</span><span>a</span><span>i</span><span>l</span>
        </div>
        <span class="status-pill ${state.submitted ? "success" : ""}">
          ${state.submitted ? "Inbox ready" : "Sign-in form"}
        </span>
        <h3>Sign in</h3>
        <p>Use the lesson account to continue to Gmail.</p>
        <div class="demo-field">
          <label for="user">Username</label>
          <input id="user" name="user" value="${escapeHtml(state.user)}" autocomplete="username">
        </div>
        <div class="demo-field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" value="${escapeHtml(state.password)}" autocomplete="current-password">
        </div>
        <div class="gmail-actions">
            <button class="gmail-link-button" type="button">Forgot username?</button>
          <button class="demo-button ${state.submitted ? "is-signed-in" : ""}" type="submit">
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
      });
      passwordInput.addEventListener("input", event => {
        demoState.password = event.target.value;
      });
      signInForm.addEventListener("submit", event => {
        event.preventDefault();
        demoState.submitted = true;
        renderDemo();
        scheduleDemoResultReset();
      });
    },
    validate: state => state.submitted,
    hints: ["Filled Username", "Filled Password", "Clicked Sign in", "Found visible text: Inbox ready"]
  },
  {
    title: "Find the Right Element",
    short: "role + name",
    time: "9 min",
    summary:
      "Find the exact button by role and name instead of relying on visual position.",
    goal: "Choose a product by accessible button name and avoid depending on visual order.",
    userAction:
      "In the product picker, the user clicks Choose Team plan. There are several similar buttons, so the exact one matters.",
    playwrightAction:
      "The code searches for a button named Choose Team plan instead of clicking the second card by position.",
    successCheck:
      "Run test should pass when the status says Selected: Team.",
    conceptTitle: "Role plus name beats position",
    conceptBody: [
      { label: "Role", value: "button", note: "Several controls share this type." },
      { label: "Name", value: "Choose Team plan", note: "The exact button Playwright should pick." },
      { label: "Avoid", value: "position", note: "Do not rely on second card or visual order." }
    ],
    conceptCode: "page.getByRole('button', { name: 'Choose Team plan' })",
    demoPath: "/plans",
    demoTitle: "Product picker",
    tasks: [
      "Compare the repeated product cards.",
      "Click the button whose name includes the product you want.",
      "Assert that the selected product appears in the status area."
    ],
    code: `import { test, expect } from '@playwright/test';

test('selects the team plan', async ({ page }) => {
  await page.goto('/plans');

  await page
    .getByRole('button', { name: 'Choose Team plan' })
    .click();

  await expect(page.getByText('Selected: Team')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/plans');":
        "A real test opens /plans from a fresh page.",
      ".getByRole('button', { name: 'Choose Team plan' })":
        "Choose the button by its accessible role and exact visible name.",
      ".click();":
        "Click the locator found on the line above.",
      "await expect(page.getByText('Selected: Team')).toBeVisible();":
        "Confirm the app selected the intended plan."
    },
    initial: () => ({ selected: "" }),
    resultSteps: [
      { text: "Test opens /plans", codeLine: "await page.goto('/plans');" },
      { text: "Located Choose Team plan button", codeLine: ".getByRole('button', { name: 'Choose Team plan' })" },
      {
        text: "Clicked the selected locator",
        codeLine: ".click();",
        apply: state => ({ ...state, selected: "Team" })
      },
      { text: "Found visible text: Selected: Team", codeLine: "await expect(page.getByText('Selected: Team')).toBeVisible();" }
    ],
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.selected ? "success" : ""}">
          ${state.selected ? `Selected: ${state.selected}` : "No plan selected"}
        </span>
        <h3>Choose a plan</h3>
        <div class="product-grid">
          ${["Starter", "Team", "Scale", "Enterprise"].map(plan => `
            <div class="product">
              <strong>${plan}</strong>
              <span>${plan === "Team" ? "Best for collaboration" : "Automation practice plan"}</span>
              <button class="demo-button secondary" data-plan="${plan}">Choose ${plan} plan</button>
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
    validate: state => state.selected === "Team",
    hints: ["Located button by role", "Clicked Choose Team plan", "Found visible text: Selected: Team"]
  },
  {
    title: "Check the Result",
    short: "expect",
    time: "7 min",
    summary:
      "Click two product actions, read the visible result, and assert the exact text users see.",
    goal: "Use `expect(locator).toHaveText()` to verify the cart count reaches the expected value.",
    userAction:
      "The user clicks Add keyboard and Add mouse in the Demo App.",
    playwrightAction:
      "The code clicks both add buttons, then checks the cart-count element text.",
    successCheck:
      "Run test should pass when the badge says 2 items.",
    conceptTitle: "Assertions prove the result",
    conceptBody: [
      { label: "Locator", value: "cart-count", note: "The badge the test reads." },
      { label: "Expected", value: "2 items", note: "The exact text users should see." },
      { label: "Assertion", value: "toHaveText()", note: "Waits until the text matches." }
    ],
    conceptCode: "expect(page.getByTestId('cart-count')).toHaveText('2 items')",
    demoPath: "/cart",
    demoTitle: "Cart counter",
    tasks: [
      "Add two products to the cart.",
      "Read the cart count from the visible badge.",
      "Assert the exact text that users see."
    ],
    codeTips: {
      "await page.goto('/cart');":
        "A real test opens /cart from a fresh page.",
      "await page.getByRole('button', { name: 'Add keyboard' }).click();":
        "Click the first product button the user sees.",
      "await page.getByRole('button', { name: 'Add mouse' }).click();":
        "Click the second product button so the cart has two items.",
      "await expect(page.getByTestId('cart-count')).toHaveText('2 items');":
        "`toHaveText` waits until the cart badge says exactly 2 items. If only one product was added, this fails."
    },
    scenarios: {
      pass: {
        code: `import { test, expect } from '@playwright/test';

test('updates the cart count', async ({ page }) => {
  await page.goto('/cart');

  await page.getByRole('button', { name: 'Add keyboard' }).click();
  await page.getByRole('button', { name: 'Add mouse' }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('2 items');
});`,
        resultSteps: [
          { text: "Test opens /cart", codeLine: "await page.goto('/cart');" },
          {
            text: "Clicked Add keyboard",
            codeLine: "await page.getByRole('button', { name: 'Add keyboard' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedKeyboard: true })
          },
          {
            text: "Clicked Add mouse",
            codeLine: "await page.getByRole('button', { name: 'Add mouse' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedMouse: true })
          },
          { text: "Expected cart count: 2 items", codeLine: "await expect(page.getByTestId('cart-count')).toHaveText('2 items');" }
        ],
        validate: state => state.count === 2
      },
      fail: {
        code: `import { test, expect } from '@playwright/test';

test('updates the cart count', async ({ page }) => {
  await page.goto('/cart');

  await page.getByRole('button', { name: 'Add keyboard' }).click();

  await expect(page.getByTestId('cart-count')).toHaveText('2 items');
});`,
        resultSteps: [
          { text: "Test opens /cart", codeLine: "await page.goto('/cart');" },
          {
            text: "Clicked Add keyboard",
            codeLine: "await page.getByRole('button', { name: 'Add keyboard' }).click();",
            apply: state => ({ ...state, count: state.count + 1, addedKeyboard: true })
          },
          { text: "Expected 2 items, found 1 item", codeLine: "await expect(page.getByTestId('cart-count')).toHaveText('2 items');" }
        ],
        validate: state => state.count === 2
      }
    },
    initial: () => ({ count: 0 }),
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.count ? "success" : ""}" data-testid="cart-count">
          ${state.count} ${state.count === 1 ? "item" : "items"}
        </span>
        <h3>Desk store</h3>
        <p>Add two products. One product is not enough for this assertion.</p>
        <div class="cart-products">
          <button class="demo-button" data-action="add-keyboard" ${state.addedKeyboard || state.count >= 2 ? "disabled" : ""}>Add keyboard</button>
          <button class="demo-button secondary" data-action="add-mouse" ${state.addedMouse || state.count >= 2 ? "disabled" : ""}>Add mouse</button>
        </div>
      </article>`,
    bind: surface => {
      surface.querySelector('[data-action="add-keyboard"]').addEventListener("click", () => {
        if (demoState.addedKeyboard || demoState.count >= 2) return;
        demoState.addedKeyboard = true;
        demoState.count += 1;
        renderDemo();
      });
      surface.querySelector('[data-action="add-mouse"]').addEventListener("click", () => {
        if (demoState.addedMouse || demoState.count >= 2) return;
        demoState.addedMouse = true;
        demoState.count += 1;
        renderDemo();
      });
    },
    hints: ["Clicked Add keyboard", "Clicked Add mouse", "Read data-testid cart-count", "Expected text: 2 items"]
  },
  {
    title: "Wait for UI Changes",
    short: "auto-wait",
    time: "10 min",
    summary:
      "Click a delayed action and let Playwright wait until the final result appears.",
    goal: "Let Playwright wait for the final visible state instead of adding manual timeouts.",
    userAction:
      "The user clicks Generate report and waits until the status changes from Generating to Report ready.",
    playwrightAction:
      "The code clicks the button and lets Playwright wait for the final text to become visible.",
    successCheck:
      "Run test should pass only after Report ready appears.",
    conceptTitle: "Playwright waits like a patient user",
    conceptBody: [
      { label: "Action", value: "Generate report", note: "Starts a delayed UI change." },
      { label: "Wait", value: "auto-wait", note: "Playwright waits through the loading state." },
      { label: "Result", value: "Report ready", note: "The final visible text to verify." }
    ],
    conceptCode: "expect(page.getByText('Report ready')).toBeVisible()",
    demoPath: "/reports",
    demoTitle: "Async report",
    tasks: [
      "Click the button that starts loading.",
      "Notice the temporary loading state.",
      "Assert the completed report text."
    ],
    code: `import { test, expect } from '@playwright/test';

test('generates the weekly report', async ({ page }) => {
  await page.goto('/reports');

  await page.getByRole('button', { name: 'Generate report' }).click();

  await expect(page.getByText('Report ready')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/reports');":
        "A real test opens /reports from a fresh page.",
      "await page.getByRole('button', { name: 'Generate report' }).click();":
        "Start the async report generation.",
      "await expect(page.getByText('Report ready')).toBeVisible();":
        "Wait for the final visible message instead of using a fixed timeout."
    },
    initial: () => ({ status: "idle" }),
    resultSteps: [
      { text: "Test opens /reports", codeLine: "await page.goto('/reports');" },
      {
        text: "Clicked Generate report",
        codeLine: "await page.getByRole('button', { name: 'Generate report' }).click();",
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
        <h3>Weekly report</h3>
        <p>The report needs a moment before the final state appears.</p>
        <button class="demo-button" data-action="generate" ${state.status === "loading" ? "disabled" : ""}>
          Generate report
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
    hints: ["Clicked Generate report", "Waited for visible final state", "Found visible text: Report ready"]
  },
  {
    title: "Debug a Broken Test",
    short: "debugging",
    time: "12 min",
    summary:
      "Read the failed state, add the missing action, and verify the fixed result.",
    goal: "Use the runner output to spot the missing action and fix the scenario.",
    userAction:
      "The user first presses Run test to see the missing state. Then the user clicks Enable release alerts and runs it again.",
    playwrightAction:
      "The code performs the missing click and expects the enabled message to appear.",
    successCheck:
      "Run test should pass when Release alerts enabled is visible.",
    conceptTitle: "Debugging means reading the missing state",
    conceptBody: [
      { label: "Failure clue", value: "text missing", note: "The expected result did not appear." },
      { label: "Missing action", value: "click alerts", note: "The test must enable the setting first." },
      { label: "Proof", value: "enabled text", note: "The final message confirms the fix." }
    ],
    conceptCode: "expect(page.getByText('Release alerts enabled')).toBeVisible()",
    demoPath: "/settings",
    demoTitle: "Notification settings",
    tasks: [
      "Try running the test before enabling notifications.",
      "Turn on the setting in the demo app.",
      "Run again and read the passing log."
    ],
    code: `import { test, expect } from '@playwright/test';

test('enables release notifications', async ({ page }) => {
  await page.goto('/settings');

  await page
    .getByRole('button', { name: 'Enable release alerts' })
    .click();

  await expect(page.getByText('Release alerts enabled')).toBeVisible();
});`,
    codeTips: {
      "await page.goto('/settings');":
        "A real test opens /settings from a fresh page.",
      ".getByRole('button', { name: 'Enable release alerts' })":
        "Find the exact settings button by role and name.",
      ".click();":
        "Perform the missing action.",
      "await expect(page.getByText('Release alerts enabled')).toBeVisible();":
        "Confirm the enabled message appears."
    },
    initial: () => ({ enabled: false }),
    resultSteps: [
      { text: "Test opens /settings", codeLine: "await page.goto('/settings');" },
      { text: "Located Enable release alerts button", codeLine: ".getByRole('button', { name: 'Enable release alerts' })" },
      {
        text: "Clicked the selected locator",
        codeLine: ".click();",
        apply: state => ({ ...state, enabled: true })
      },
      { text: "Found visible text: Release alerts enabled", codeLine: "await expect(page.getByText('Release alerts enabled')).toBeVisible();" }
    ],
    render: state => `
      <article class="demo-card">
        <span class="status-pill ${state.enabled ? "success" : ""}">
          ${state.enabled ? "Release alerts enabled" : "Release alerts off"}
        </span>
        <h3>Notification settings</h3>
        <p>Use this screen to practice reading a failing test and fixing the page state.</p>
        <button class="demo-button" data-action="enable-alerts">Enable release alerts</button>
        ${state.enabled ? '<div class="toast">Release alerts enabled</div>' : ""}
      </article>`,
    bind: surface => {
      surface.querySelector('[data-action="enable-alerts"]').addEventListener("click", () => {
        demoState.enabled = true;
        renderDemo();
      });
    },
    validate: state => state.enabled,
    hints: ["Clicked Enable release alerts", "Found toast text", "Trace would show the completed action"]
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
const lessonSummary = document.querySelector("#lesson-summary");
const lessonGoal = document.querySelector("#lesson-goal");
const userAction = document.querySelector("#user-action");
const playwrightAction = document.querySelector("#playwright-action");
const successCheck = document.querySelector("#success-check");
const conceptTitle = document.querySelector("#concept-title");
const conceptBody = document.querySelector("#concept-body");
const taskList = document.querySelector("#task-list");
const demoTitle = document.querySelector("#demo-title");
const demoAddress = document.querySelector("#demo-address");
const demoSurface = document.querySelector("#demo-surface");
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
    <button class="lesson-button example-button" id="example-button" type="button" aria-pressed="${exampleRunning}">
      <span class="example-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m8 5 11 7-11 7V5Z"></path>
        </svg>
      </span>
      <span>
        <strong>Example</strong>
        <span>Automated preview</span>
      </span>
      <span class="example-state">${exampleRunning ? "Stop" : "Start"}</span>
    </button>
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

  document.querySelector("#example-button").addEventListener("click", () => {
    if (exampleRunning) {
      stopExampleAutomation();
    } else {
      runExampleAutomation();
    }
  });
}

function renderLesson() {
  const lesson = lessons[activeLessonIndex];

  renderLessonList();
  lessonStep.textContent = `Step ${activeLessonIndex + 1} of ${lessons.length}`;
  lessonTime.textContent = lesson.time;
  lessonTitle.textContent = lesson.title;
  lessonSummary.textContent = lesson.summary;
  lessonGoal.textContent = lesson.goal;
  userAction.textContent = lesson.userAction;
  playwrightAction.textContent = lesson.playwrightAction;
  successCheck.textContent = "Start with a manual test, then click Run test to follow the automation test.";
  conceptTitle.textContent = lesson.conceptCode;
  conceptBody.innerHTML = renderConceptBody(lesson.conceptBody);
  demoTitle.textContent = lesson.demoTitle;
  demoAddress.textContent = `https://demo.playwright-lab.test${lesson.demoPath}`;
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

function scrollElementBy(element, amount) {
  const previousTop = element.scrollTop;
  element.scrollTop += amount;
  return element.scrollTop !== previousTop;
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
    demoState = { ...demoState, submitted: false };
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
    if (runAnimationId !== animationId) return;
    const step = steps[index];
    if (step.apply) {
      demoState = step.apply(demoState);
      renderDemo();
    }
    highlightTraceStep(index, "complete");
    await sleep(delay);
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
  if (exampleAnimationId !== animationId) return false;
  target.scrollIntoView({ block: "center", behavior: "smooth" });
  await sleep(300);
  if (exampleAnimationId !== animationId) return false;
  moveAutomationCursorTo(target);
  await sleep(1000);
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

function stopExampleAutomation({ preserveRunner = false } = {}) {
  exampleAnimationId += 1;
  exampleRunning = false;
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
    await sleep(200);
  }
  return exampleAnimationId === animationId;
}

async function runExampleAutomation() {
  const animationId = exampleAnimationId + 1;
  exampleAnimationId = animationId;
  exampleRunning = true;
  renderLessonList();
  automationCursor.classList.add("is-visible");

  for (let index = 0; index < lessons.length; index += 1) {
    if (exampleAnimationId !== animationId) return;
    if (index === 3) {
      lesson4Scenario = "pass";
    }
    const lessonButton = lessonList.querySelector(`[data-lesson="${index}"]`);
    if (!await automationClick(lessonButton, animationId)) return;

    await sleep(350);
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
