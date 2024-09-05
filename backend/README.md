- The sortedBalances computation uses useMemo, which is good for performance optimization.
  However, the memoization dependencies include both balances and prices, but prices are
  not used inside the memoized function. This can cause unnecessary recomputations when
  prices change.
