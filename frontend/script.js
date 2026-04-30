document.addEventListener('DOMContentLoaded', () => {
    let itemIdCounter = 1;
    const itemsContainer = document.getElementById('items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const solveBtn = document.getElementById('solve-btn');
    const capacityInput = document.getElementById('capacity');
    
    const resultsSection = document.getElementById('results-section');
    const maxValueEl = document.getElementById('max-value');
    const selectedItemsEl = document.getElementById('selected-items');
    const dpTable = document.getElementById('dp-table');

    // Add initial items
    addItem(10, 60);
    addItem(20, 100);
    addItem(30, 120);

    // Event Listeners
    addItemBtn.addEventListener('click', () => addItem());
    solveBtn.addEventListener('click', solveKnapsack);

    function addItem(weight = 1, value = 1) {
        const id = itemIdCounter++;
        const row = document.createElement('div');
        row.className = 'item-row';
        row.dataset.id = id;

        row.innerHTML = `
            <div class="item-id">Item ${id}</div>
            <div class="item-inputs">
                <div class="input-group">
                    <label>Weight</label>
                    <input type="number" class="item-weight" min="1" value="${weight}">
                </div>
                <div class="input-group">
                    <label>Value</label>
                    <input type="number" class="item-value" min="0" value="${value}">
                </div>
            </div>
            <button class="btn danger remove-btn">&times;</button>
        `;

        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
        });

        itemsContainer.appendChild(row);
    }

    function getItems() {
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const id = parseInt(row.dataset.id);
            const w = parseInt(row.querySelector('.item-weight').value) || 0;
            const v = parseInt(row.querySelector('.item-value').value) || 0;
            items.push({ id, w, v });
        });
        return items;
    }

    function solveKnapsack() {
        const W = parseInt(capacityInput.value);
        if (isNaN(W) || W <= 0) {
            alert('Please enter a valid positive capacity.');
            return;
        }

        const items = getItems();
        if (items.length === 0) {
            alert('Please add at least one item.');
            return;
        }

        const n = items.length;
        // DP Matrix
        const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

        // Build table K[][] in bottom up manner
        for (let i = 1; i <= n; i++) {
            const currentItem = items[i - 1];
            for (let w = 1; w <= W; w++) {
                if (currentItem.w <= w) {
                    dp[i][w] = Math.max(currentItem.v + dp[i - 1][w - currentItem.w], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        const maxValue = dp[n][W];
        
        // Find selected items
        let res = maxValue;
        let w = W;
        const selectedItems = [];

        for (let i = n; i > 0 && res > 0; i--) {
            // Either the result comes from the top (K[i-1][w])
            // or from (val[i-1] + K[i-1][w-wt[i-1]])
            if (res === dp[i - 1][w]) {
                continue;
            } else {
                // This item is included.
                const item = items[i - 1];
                selectedItems.push(item);
                
                // Since this weight is included its value is deducted
                res = res - item.v;
                w = w - item.w;
            }
        }

        renderResults(maxValue, items, selectedItems, dp, W);
    }

    function renderResults(maxValue, items, selectedItems, dp, W) {
        resultsSection.classList.remove('hidden');
        maxValueEl.textContent = maxValue;

        // Render selected items badges
        selectedItemsEl.innerHTML = '';
        const selectedIds = new Set(selectedItems.map(i => i.id));
        
        items.forEach(item => {
            const span = document.createElement('span');
            span.className = 'badge';
            if (selectedIds.has(item.id)) {
                span.classList.add('included');
                span.textContent = `Item ${item.id} (W:${item.w}, V:${item.v}) ✓`;
            } else {
                span.textContent = `Item ${item.id}`;
            }
            selectedItemsEl.appendChild(span);
        });

        // Render DP Table
        dpTable.innerHTML = '';
        const n = items.length;

        // Header
        const thead = document.createElement('tr');
        thead.innerHTML = `<th>i \\ w</th>` + Array.from({length: W + 1}, (_, i) => `<th>${i}</th>`).join('');
        dpTable.appendChild(thead);

        for (let i = 0; i <= n; i++) {
            const tr = document.createElement('tr');
            
            // Row label
            const th = document.createElement('th');
            if (i === 0) th.textContent = '0';
            else th.textContent = `Item ${items[i-1].id} (W:${items[i-1].w})`;
            tr.appendChild(th);

            for (let w = 0; w <= W; w++) {
                const td = document.createElement('td');
                td.textContent = dp[i][w];
                td.dataset.i = i;
                td.dataset.w = w;
                
                // Add hover interactions to trace path back
                td.addEventListener('mouseenter', (e) => highlightPath(e.target, items, dp));
                td.addEventListener('mouseleave', clearHighlights);
                
                tr.appendChild(td);
            }
            dpTable.appendChild(tr);
        }
        
        // Highlight the final answer cell
        setTimeout(() => {
            const finalCell = dpTable.querySelector(`td[data-i="${n}"][data-w="${W}"]`);
            if(finalCell) highlightPath(finalCell, items, dp);
        }, 500);
    }

    function highlightPath(cell, items, dp) {
        clearHighlights();
        
        let i = parseInt(cell.dataset.i);
        let w = parseInt(cell.dataset.w);
        
        cell.classList.add('td-active');
        
        let res = dp[i][w];
        
        while (i > 0 && res > 0) {
            const currentCell = dpTable.querySelector(`td[data-i="${i}"][data-w="${w}"]`);
            if(currentCell) currentCell.classList.add('td-highlight');

            if (res === dp[i - 1][w]) {
                // Item not included
                i--;
            } else {
                // Item included
                const item = items[i - 1];
                if(currentCell) currentCell.classList.add('td-path'); // Mark as taken
                
                res = res - item.v;
                w = w - item.w;
                i--;
            }
        }
        
        // Add highlight to 0 if we reached it
        if(i >= 0 && w >= 0) {
            const currentCell = dpTable.querySelector(`td[data-i="${i}"][data-w="${w}"]`);
            if(currentCell) currentCell.classList.add('td-highlight');
        }
    }

    function clearHighlights() {
        document.querySelectorAll('td').forEach(td => {
            td.classList.remove('td-highlight', 'td-path', 'td-active');
        });
    }
});
