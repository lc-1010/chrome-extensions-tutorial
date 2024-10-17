const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/extensions/*",
        "https://developer.chrome.com/docs/webstore/*"
    ]
});

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));
console.log(tabs);

const template = document.getElementById('li_template');
const elements = new Set();

for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split('|')[0].trim();
    const pahtname = new URL(tab.url).pathname.slice('/docs'.length);

    element.querySelector('.title').textContent = title;
    element.querySelector('.pathname').textContent = pahtname;
    element.querySelector('a').addEventListener('click', async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });
    elements.add(element);
}

let b = document.querySelector('ul');
console.log(b);
b.append(...elements);

const button = document.querySelector('button');
button.addEventListener('click', async () => {
    const tabIds = tabs.map(({ id }) => id);/*
    这段代码使用了几种现代 JavaScript 语法特性。让我来解释一下：

```javascript:chrome-extensions-tutorial/4-tabs-manager/popup.js
const tabIds = tabs.map(({id}) => id);
```

这行代码涉及以下几个概念：

1. 箭头函数（Arrow Function）:
   `() => ...` 是 ES6 引入的箭头函数语法。

2. 解构赋值（Destructuring Assignment）:
   `({id})` 使用了对象解构赋值。它从每个 tab 对象中提取 `id` 属性。

3. 简写属性名（Shorthand Property Names）:
   当解构的变量名与对象的属性名相同时，可以省略冒号和值。

4. 数组的 `map()` 方法:
   `map()` 是一个数组方法，用于遍历数组并对每个元素应用一个函数，返回一个新数组。

完整解释：

- `tabs.map(...)` 遍历 `tabs` 数组中的每个元素。
- 对于每个元素（即每个 tab 对象），它解构出 `id` 属性。
- 箭头函数 `({id}) => id` 简洁地返回这个 `id` 值。
- 最终，`tabIds` 将包含一个由所有标签页的 id 组成的新数组。

这种写法等同于更详细的版本：

```javascript
const tabIds = tabs.map(function(tab) {
    return tab.id;
});
```

或者：

```javascript
const tabIds = tabs.map(tab => tab.id);
```

这种简洁的语法在现代 JavaScript 开发中很常见，特别是在处理数组和对象时。它使代码更加简洁和表达性强，但对于不熟悉这些特性的开发者来说可能需要一些时间来适应。
*/
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: 'chrome DOCS' });
    }
    console.log(tabIds.length);
});