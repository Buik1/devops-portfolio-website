// ═══════════════════════════════════════════════════════════════
// Dashboard interactivity — counters, terminal, health bars
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    animateHealthBars();
    initTerminal();
    initMobileMenu();
});

// ─── ANIMATED COUNTERS ─────────────────────────────────────────
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const isFloat = target.includes('.');
        const end = parseFloat(target);
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = eased * end;
            el.textContent = prefix + (isFloat ? current.toFixed(2) : Math.floor(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

// ─── HEALTH BARS ───────────────────────────────────────────────
function animateHealthBars() {
    setTimeout(() => {
        document.querySelectorAll('.health-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 300);
}

// ─── MOBILE MENU ───────────────────────────────────────────────
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    // close sidebar on link click (mobile)
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => sidebar.classList.remove('open'));
    });
}

// ─── TERMINAL ──────────────────────────────────────────────────
function initTerminal() {
    const input = document.getElementById('term-input');
    const output = document.getElementById('term-output');
    if (!input || !output) return;

    // auto-type the first command
    typeCommand('neofetch', input, () => {
        setTimeout(() => runCommand('neofetch', output, input), 200);
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            if (cmd) runCommand(cmd, output, input);
        }
    });

    // focus terminal on click
    document.querySelector('.terminal-body')?.addEventListener('click', () => input.focus());
}

function typeCommand(cmd, input, callback) {
    let i = 0;
    input.value = '';
    const iv = setInterval(() => {
        input.value += cmd[i];
        i++;
        if (i >= cmd.length) {
            clearInterval(iv);
            if (callback) callback();
        }
    }, 60);
}

function runCommand(cmd, output, input) {
    // echo the command
    appendLine(output, `<span class="prompt-text">chibuike@cloud</span>:<span class="cyan">~</span>$ <span class="cmd-text">${escHtml(cmd)}</span>`);

    const result = processCommand(cmd);
    if (result !== null) {
        appendLine(output, `<span class="out-text">${result}</span>`);
    }
    // scroll to bottom
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
}

function appendLine(output, html) {
    output.innerHTML += html + '\n';
}

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function processCommand(cmd) {
    const c = cmd.trim().toLowerCase();

    if (c === 'help') return `<span class="accent">Available commands:</span>
  whoami          Who is this person
  neofetch        System info
  uptime          How long in production
  cat skills      Skills overview
  kubectl get     Running services
  terraform show  Infrastructure summary
  cat incidents   Notable incidents
  contact         Get in touch
  clear           Clear terminal
  help            This message`;

    if (c === 'whoami') return `<span class="accent">Chibuike Onuoha</span>
DevOps & Infrastructure Engineer
Lagos, Nigeria · WAT (UTC+1) · Remote worldwide

6 years running production infrastructure for fintech.
AWS, Kubernetes, Terraform, and whatever the incident needs at 2am.`;

    if (c === 'neofetch') return `<span class="accent">        ___</span>
<span class="accent">       /   \\</span>      <span class="accent">chibuike@cloud</span>
<span class="accent">      / (o) \\</span>     ─────────────────
<span class="accent">     /   _   \\</span>    <span class="cyan">OS:</span>     Production Linux (EKS AL2023)
<span class="accent">    /  (' ')  \\</span>   <span class="cyan">Host:</span>   AWS eu-west-1
<span class="accent">   /  / | \\  \\</span>  <span class="cyan">Kernel:</span> Kubernetes v1.29
<span class="accent">  /__/  |  \\__\\</span> <span class="cyan">Shell:</span>  bash + terraform + kubectl
<span class="accent">        |</span>        <span class="cyan">Uptime:</span> 6 years, 3 months
<span class="accent">       /|\\</span>       <span class="cyan">Pkgs:</span>   30 services, 200+ TF resources
<span class="accent">      / | \\</span>      <span class="cyan">CPU:</span>    ~200 vCPU (Karpenter managed)
<span class="accent">     /  |  \\</span>     <span class="cyan">Mem:</span>    ~400 GiB across 27 nodes
<span class="accent">    ‾‾‾‾‾‾‾‾‾</span>    <span class="cyan">Disk:</span>   S3 (don't ask how many TB)`;

    if (c === 'uptime') return `<span class="emerald">06:14:22 up 6 years, 3 months, load average: 0.42, 0.38, 0.35</span>
Career uptime: 2304 days
Longest incident-free streak: 47 days
Current SLO: 99.9% (payments-api)
Pages this month: 2 (both false alarms)`;

    if (c === 'cat skills' || c === 'cat skills.json') return `{
  <span class="accent">"cloud"</span>:         ["AWS (EKS, EC2, VPC, IAM, KMS, Lambda, S3)"],
  <span class="accent">"containers"</span>:    ["Kubernetes", "Docker", "Helm", "Karpenter"],
  <span class="accent">"iac"</span>:           ["Terraform", "CloudFormation", "Ansible"],
  <span class="accent">"cicd"</span>:          ["GitHub Actions", "Jenkins", "ArgoCD", "GitOps"],
  <span class="accent">"observability"</span>: ["Datadog", "Prometheus", "Grafana", "Loki"],
  <span class="accent">"scripting"</span>:     ["Python", "Bash", "Linux"],
  <span class="accent">"security"</span>:      ["IAM", "KMS", "Secrets Manager", "IRSA", "VPC design"],
  <span class="accent">"opinion"</span>:       "Boring tech. Small blast radius. Fix on-call first."
}`;

    if (c === 'kubectl get' || c === 'kubectl get deployments' || c === 'kubectl get deploy') return `<span class="accent">NAMESPACE     NAME                    READY   STATUS    AGE</span>
payments      payments-api            4/4     Running   287d
payments      webhook-dispatcher      2/2     Running   287d
payments      ledger-service          3/3     Running   245d
platform      argocd-server           2/2     Running   310d
platform      argocd-repo-server      2/2     Running   310d
monitoring    prometheus-server        1/1     Running   280d
monitoring    grafana                 1/1     Running   280d
monitoring    loki-distributor        2/2     Running   265d
karpenter     karpenter               2/2     Running   300d
ingress       aws-lb-controller       2/2     Running   310d`;

    if (c === 'terraform show' || c === 'terraform plan') return `<span class="accent"># Infrastructure Summary (prod)</span>
<span class="emerald">State:</span>  5 state files (network, cluster, platform, data, iam)
<span class="emerald">Region:</span> eu-west-1

Resources by layer:
  00-network:   VPC, 6 subnets, 2 NAT GW, route tables    <span class="cyan">18 resources</span>
  10-cluster:   EKS 1.29, IRSA, Karpenter, node IAM        <span class="cyan">34 resources</span>
  20-platform:  ArgoCD, ALB ctrl, external-dns, cert-mgr    <span class="cyan">42 resources</span>
  30-data:      RDS Postgres, ElastiCache, MSK, S3           <span class="cyan">28 resources</span>
  40-iam:       12 service roles, OIDC, boundary policies    <span class="cyan">51 resources</span>

  Total: <span class="accent">173 managed resources</span>
  Drift: <span class="emerald">None detected</span> (last plan: 2h ago)`;

    if (c === 'cat incidents' || c === 'cat /var/log/incidents') return `<span class="accent">INCIDENT LOG (last 12 months)</span>
─────────────────────────────────────────────────────
<span class="red">2024-01-16 01:52 WAT</span>  HPA/Karpenter race condition
  Impact: 18min partial unavailability, 6% 5xx rate
  Root cause: aggressive consolidation + HPA default scaling
  Fix: 3-line config change (consolidationPolicy, HPA behavior)
  <span class="emerald">Status: Resolved. Zero recurrence.</span>

<span class="red">2023-10-04 02:30 WAT</span>  TCP rate-limit during EKS migration
  Impact: 429s from payments processor (wave 4)
  Root cause: NAT egress IP rotation on pod reschedule
  Fix: dedicated NAT + backoff in worker
  <span class="emerald">Status: Resolved. Added to pre-flight checklist.</span>

Total incidents (12mo): 2 significant, 4 minor
Mean time to resolve: 22 minutes`;

    if (c === 'contact' || c === 'curl api/contact') return `{
  <span class="accent">"name"</span>:     "Chibuike Onuoha",
  <span class="accent">"email"</span>:    "<span class="cyan">bykonuoha@gmail.com</span>",
  <span class="accent">"linkedin"</span>: "linkedin.com/in/chibuike-onuoha-7b5aa7382",
  <span class="accent">"location"</span>: "Lagos, Nigeria (UTC+1)",
  <span class="accent">"status"</span>:   "<span class="emerald">Open to remote roles — any level, contract or full-time</span>",
  <span class="accent">"reply"</span>:    "Same day"
}`;

    if (c === 'clear') {
        document.getElementById('term-output').innerHTML = '';
        return null;
    }

    if (c === 'ls') return `<span class="accent">deployments/</span>  infrastructure/  scripts/  runbooks/  <span class="cyan">README.md</span>`;

    if (c === 'cat readme.md' || c === 'cat readme') return `<span class="accent"># Chibuike Onuoha — Production Infrastructure</span>

I run production for fintech. AWS, Kubernetes, Terraform,
and whatever else the incident needs at 2am.

Looking for remote work — any level, contract or permanent.
Fintech, developer tools, and infra-heavy SaaS preferred.

<span class="cyan">→ bykonuoha@gmail.com</span>`;

    if (c === 'exit' || c === 'quit') return `<span class="text-dim">Logout? In this economy? Type 'contact' instead.</span>`;

    return `<span class="red">command not found:</span> ${escHtml(cmd)}. Type <span class="accent">help</span> for available commands.`;
}
