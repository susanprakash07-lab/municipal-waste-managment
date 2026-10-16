import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import EmptyState from './EmptyState';
import { TableSkeleton } from './LoadingSpinner';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  // Search & Filter controls
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterOptions = [], // [{ label, value, options, onChange }]
  // Pagination
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  // Add action
  onAddNew,
  addNewLabel = 'Add Record',
  // Row actions
  onView,
  onEdit,
  onDelete,
  canDelete = true,
  // Sorting
  sortField,
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your search criteria or add a new record.'
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Top Action & Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400"
          />
        </div>

        {/* Filter Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {filterOptions.map((filter, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
              >
                {filter.options.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const lbl = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 ml-auto lg:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>{addNewLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <TableSkeleton rows={6} cols={columns.length + 1} />
        ) : data.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            actionLabel={onAddNew ? addNewLabel : undefined}
            onAction={onAddNew}
          />
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-100">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-4 sm:px-6 py-3.5 ${col.className || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => onSort && onSort(col.accessor)}
                        className="flex items-center gap-1.5 hover:text-slate-800 transition-colors uppercase font-semibold text-xs tracking-wider"
                      >
                        {col.header}
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {(onView || onEdit || onDelete) && (
                  <th scope="col" className="px-4 sm:px-6 py-3.5 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-slate-50/70 transition-colors duration-100 group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-slate-700 ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            title="View details"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            title="Edit record"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && canDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            title="Delete record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && data.length > 0 && (
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{data.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalRecords || data.length}</span> records
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
