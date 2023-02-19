import { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import { BookInfoType } from "../../Type/interface";
import { bookSearchHandler } from "../../apis/api/book";
import ItemList from "./ItemList";
import GetBookList from "../../utils/getBookList";
type InterSectionType = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;
export default function Main(): JSX.Element {
  let [book, setBook] = useState<BookInfoType[]>([]);
  let sortel = ["accuracy", "latest"];
  let [sort, setSort] = useState(0);
  let [searchValue, setSearchValue] = useState("");
  let [bookList, getBookList] = useState<BookInfoType[]>([]);
  let [page, setPage] = useState(1);
  //let observerRef = useRef(null);
  // target 지정하기 : 마지막 요소
  // let target = document.querySelector(".target");
  // console.log(target);
  let [lastBook, setLastBook] = useState(null);
  //console.log(observerRef);
  /*const getBook = () => {
    console.log(input);

    bookSearchHandler(input, sort, page).then((res) =>
      getBookList((prev) => prev.concat(res.documents))
    );
  };*/
  const interSection: InterSectionType = (entries, observer) => {
    console.log(entries);
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
        observer.unobserve(entry.target);
      }
    });
  };
  useEffect(() => {
    if (searchValue) {
      bookSearchHandler(searchValue, sortel[sort], page).then((res) =>
        getBookList((prev) => prev.concat(res.documents))
      );
    }
    console.log(page);
    console.log(bookList);
    console.log(lastBook);
  }, [page, searchValue]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (lastBook) {
      console.log(lastBook);
      observer = new IntersectionObserver(interSection, {
        root: null,
        threshold: 1,
      });
      observer.observe(lastBook);
    }
    return () => observer && observer.disconnect();
  }, [lastBook]);

  return (
    <>
      <SearchInput
        setSearchValue={setSearchValue}
        setSort={setSort}
        sort={sort}
      />
      <ItemList book={bookList} a={setLastBook} />
    </>
  );
}
