import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

// У змінну отримуємо значення з властивості default.
// За допомогою as додаємо всю оригінальну типізацію ReactPaginateProps.
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// Інтерфейс для пропсів компонента Pagination
interface PaginationProps {
  pageTotal: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

function Pagination({ pageTotal, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageTotal}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
    />
  );
}

export default Pagination;
