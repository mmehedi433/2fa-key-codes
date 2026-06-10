async function loadCodes() {
    const res = await fetch("/api/codes");
    const accounts = await res.json();

    document.getElementById("accounts").innerHTML = accounts
        .map((acc) => {
            const width = (acc.remaining / 30) * 100;

            return `
<div class="row">

    <div>
        <strong>${acc.name}</strong>
    </div>

    <div class="code"
         onclick="copyCode(this,'${acc.code}')">
         ${acc.code}
    </div>

    <div class="progress">
        <div class="progress-fill"
             style="width:${width}%">
        </div>
    </div>

    <div class="actions">
        <button style="display:none" onclick="editAccount(${acc.id}, '${acc.name}', '${acc.secret || ""}')">
            ✏️
        </button>

        <button class="icon-btn" onclick="deleteAccount(${acc.id})">
            🗑️
        </button>
    </div>

</div>
`;
        })
        .join("");
}

async function addAccount() {
    const name = document.getElementById("name").value;
    const secret = document.getElementById("secret").value;

    if (!name || !secret) {
        alert("Enter name and secret");
        return;
    }

    await fetch("/api/accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            secret,
        }),
    });

    document.getElementById("name").value = "";
    document.getElementById("secret").value = "";

    loadCodes();
}

async function deleteAccount(id) {
    if (!confirm("Delete this account?")) {
        return;
    }

    await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
    });

    loadCodes();
}

async function editAccount(id, currentName, currentSecret) {
    const name = prompt("Name", currentName);

    if (name === null) return;

    const secret = prompt("Secret", currentSecret);

    if (secret === null) return;

    await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            secret,
        }),
    });

    loadCodes();
}

async function copyCode(element, code) {
    await navigator.clipboard.writeText(code);

    element.classList.add("copied");

    showToast("✓ OTP Copied");

    setTimeout(() => {
        element.classList.remove("copied");
    }, 400);
}

function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}
async function copyCode(element, code) {
    await navigator.clipboard.writeText(code);

    const original = element.innerText;

    element.innerText = "✓ Copied";

    element.classList.add("copied");

    setTimeout(() => {
        element.innerText = original;
        element.classList.remove("copied");
    }, 800);

    showToast("OTP Copied");
}

setInterval(loadCodes, 1000);

loadCodes();
