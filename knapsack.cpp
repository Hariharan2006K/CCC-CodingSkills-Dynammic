#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Structure to represent an item
struct Item {
    int id;
    int weight;
    int value;
};

// Function to solve 0-1 Knapsack using Dynamic Programming
// Returns a pair containing the max value and a 2D DP table
pair<int, vector<vector<int>>> solveKnapsack(int W, const vector<Item>& items) {
    int n = items.size();
    // Create a 2D vector (DP table) of size (n+1) x (W+1), initialized to 0
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    // Build the DP table in a bottom-up manner
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (items[i - 1].weight <= w) {
                // Max of including the item or excluding it
                dp[i][w] = max(items[i - 1].value + dp[i - 1][w - items[i - 1].weight], dp[i - 1][w]);
            } else {
                // Item's weight is more than current capacity, exclude it
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return {dp[n][W], dp};
}

// Function to traceback the DP table and find selected items
vector<Item> getSelectedItems(int W, const vector<Item>& items, const vector<vector<int>>& dp) {
    int n = items.size();
    int res = dp[n][W];
    int w = W;
    vector<Item> selectedItems;

    for (int i = n; i > 0 && res > 0; i--) {
        // If the result did not come from the cell above, the item was included
        if (res != dp[i - 1][w]) {
            selectedItems.push_back(items[i - 1]);
            // Deduct the value and weight
            res -= items[i - 1].value;
            w -= items[i - 1].weight;
        }
    }
    
    // Reverse to maintain original relative order (optional)
    reverse(selectedItems.begin(), selectedItems.end());
    return selectedItems;
}

int main() {
    // Example usage
    int capacity = 8;
    vector<Item> items = {
        {1, 10, 60}, // {id, weight, value} (Note: weight > capacity so this won't fit)
        {2, 2, 100},
        {3, 3, 120},
        {4, 4, 150}
    };

    cout << "Knapsack Capacity: " << capacity << "\n\n";
    cout << "Available Items:\n";
    for(const auto& item : items) {
        cout << "Item " << item.id << " - Weight: " << item.weight << ", Value: " << item.value << "\n";
    }

    // Solve
    auto result = solveKnapsack(capacity, items);
    int maxValue = result.first;
    auto dpTable = result.second;

    cout << "\nOptimal Max Value: " << maxValue << "\n";

    // Traceback
    vector<Item> selected = getSelectedItems(capacity, items, dpTable);
    cout << "Selected Items: \n";
    for(const auto& item : selected) {
        cout << " -> Item " << item.id << " (W: " << item.weight << ", V: " << item.value << ")\n";
    }

    return 0;
}
