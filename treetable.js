class TreeNode {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.node = [];
    }

    addNode(name, icon) {
        const childNode = new TreeNode(name, icon);
        this.node.push(childNode);
        return childNode;
    }

    getNodes() {
        return this.node;
    }
}

class ContextMenu {
    constructor(container) {
        this.container = container;
        this.contextmenuQuerySelector = ".c0af77cf8294ff93a5cdb2963ca9f038-contextmenu";

        this.copyable = ["SPAN", "P", "H1", "H2", "H3", "H4", "H5", "H6", "STRONG"];
    }

    hide() {
        const clickedElement = event.target;
        const contextmenu = document.querySelectorAll(this.contextmenuQuerySelector);

        if (
            clickedElement !== contextmenu
        ) {
            contextmenu.forEach(function (menu) {
                menu.parentNode.removeChild(menu)
            })
        }
    }

    pop(event, x, y) {
        const target = event.target;

        const menu = document.createElement("div");
        menu.className = this.contextmenuQuerySelector.slice(1);
        document.body.appendChild(menu);
        const contextmenu = document.querySelector(this.contextmenuQuerySelector);
        contextmenu.innerHTML = "";

        const menuItems = {
            "Copy": () => {
                const tag = target.tagName;
                if (this.copyable.includes(tag)) {
                    const text = target.textContent;
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            new ToastN(ToastN.TYPE.SUCCESS).show("Copied!", 2);
                        })
                        .catch((error) => {
                            new ToastN(ToastN.TYPE.ERROR).show("Failed!", 2);
                        });
                }
            }
        };

        for (var [text, action] of Object.entries(menuItems)) {
            const listItem = document.createElement("li");

            listItem.textContent = text;
            listItem.addEventListener("click", action);

            contextmenu.appendChild(listItem);
        }


        contextmenu.style.left = (x + 0) + "px";
        contextmenu.style.top = (y + 0) + "px";
    };

    create() {
        const container = document.querySelector(this.container);

        container.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const target = event.target;

            this.hide();

            const x = event.pageX;
            const y = event.pageY;

            this.pop(event, x, y);
        });

        document.addEventListener('click', (event) => {
            this.hide();
        });
    }
}

class TreeTable {
    constructor(container) {
        this.container = container;
        this.parents = [];
    }

    add(parentNode) {
        this.parents.push(parentNode);
    }

    render() {
        let html = '';
        this.parents.forEach(parentNode => {
            html += this.get(parentNode);
        });
        this.renderTable(html);
    }

    get(node) {
        const childNodes = node.getNodes();
        const hasChildNodes = childNodes.length > 0;

        let html = `
        <div class="c0af77cf8294ff93a5cdb2963ca9f038">
            <details class="parent-node">
                <summary class="parent-node-title">
                    <div class="node-label">
                        <span><strong>${node.name}</strong></span>
                        ${node.icon ? node.icon : ''}
                    </div>
                </summary>
        `;

        if (hasChildNodes) {
            html += this.renderNodes(childNodes);
        }

        html += `
            </details>
        </div>
        `;

        return html;
    }

    renderNodes(nodes) {
        let html = `<table class="node-table">`;
        nodes.forEach(node => {
            html += `
                <tr>
                    <td class="indent">
                        <details>
                            <summary class="data-parent-node">
                                <div class="node-label">
                                    ${node.icon ? node.icon : ''}
                                    <span>${node.name}</span>
                                </div>
                            </summary>
            `;

            const childNodes = node.getNodes();
            const hasChildNodes = childNodes.length > 0;

            if (hasChildNodes) {
                html += this.renderNodes(childNodes);
            }

            html += `
                        </details>
                    </td>
                </tr>
            `;
        });
        html += `</table>`;
        return html;
    }

    renderTable(html) {
        document.querySelector(this.container).innerHTML = html;
    }

    createContextMenu() {
        const contextmenu = new ContextMenu(this.container);
        contextmenu.create();
    }
}
/*

const treetable = new TreeTable(".tree");
const parent1 = new TreeNode("192.168.100.10");
const child1 = parent1.addNode("10");
const grandchild1 = child1.addNode("1010");

treetable.add(parent1);

const parent2 = new TreeNode("192.168.100.3", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#76C45B" class="bi bi-android2" viewBox="0 0 16 16">
<path d="m10.213 1.471.691-1.26q.069-.124-.048-.192-.128-.057-.195.058l-.7 1.27A4.8 4.8 0 0 0 8.005.941q-1.032 0-1.956.404l-.7-1.27Q5.281-.037 5.154.02q-.117.069-.049.193l.691 1.259a4.25 4.25 0 0 0-1.673 1.476A3.7 3.7 0 0 0 3.5 5.02h9q0-1.125-.623-2.072a4.27 4.27 0 0 0-1.664-1.476ZM6.22 3.303a.37.37 0 0 1-.267.11.35.35 0 0 1-.263-.11.37.37 0 0 1-.107-.264.37.37 0 0 1 .107-.265.35.35 0 0 1 .263-.11q.155 0 .267.11a.36.36 0 0 1 .112.265.36.36 0 0 1-.112.264m4.101 0a.35.35 0 0 1-.262.11.37.37 0 0 1-.268-.11.36.36 0 0 1-.112-.264q0-.154.112-.265a.37.37 0 0 1 .268-.11q.155 0 .262.11a.37.37 0 0 1 .107.265q0 .153-.107.264M3.5 11.77q0 .441.311.75.311.306.76.307h.758l.01 2.182q0 .414.292.703a.96.96 0 0 0 .7.288.97.97 0 0 0 .71-.288.95.95 0 0 0 .292-.703v-2.182h1.343v2.182q0 .414.292.703a.97.97 0 0 0 .71.288.97.97 0 0 0 .71-.288.95.95 0 0 0 .292-.703v-2.182h.76q.436 0 .749-.308.31-.307.311-.75V5.365h-9zm10.495-6.587a.98.98 0 0 0-.702.278.9.9 0 0 0-.293.685v4.063q0 .406.293.69a.97.97 0 0 0 .702.284q.42 0 .712-.284a.92.92 0 0 0 .293-.69V6.146a.9.9 0 0 0-.293-.685 1 1 0 0 0-.712-.278m-12.702.283a1 1 0 0 1 .712-.283q.41 0 .702.283a.9.9 0 0 1 .293.68v4.063a.93.93 0 0 1-.288.69.97.97 0 0 1-.707.284 1 1 0 0 1-.712-.284.92.92 0 0 1-.293-.69V6.146q0-.396.293-.68"/>
</svg>`);
const child2 = parent2.addNode("3");
child2.addNode("Unkndown", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>`);
child2.addNode("22", `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open-fill" viewBox="0 0 16 16">
  <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
</svg>`);

treetable.add(parent2);

treetable.render();

treetable.createContextMenu();
*/