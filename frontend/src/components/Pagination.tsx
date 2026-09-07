interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="pagination">
      <span className="pagination__summary">
        {from}–{to} trong {total}
      </span>
      <div className="pagination__controls">
        <button className="btn btn--ghost btn--sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ← Trước
        </button>
        <span className="pagination__page">
          Trang {page}/{totalPages}
        </span>
        <button className="btn btn--ghost btn--sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Sau →
        </button>
      </div>
    </div>
  );
}
