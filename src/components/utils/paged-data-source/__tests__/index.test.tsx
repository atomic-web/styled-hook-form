import { getByTestId } from "@testing-library/dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { ChangeEvent, useState } from "react";
import { usePagedData } from "..";
import "jest-fix-undefined";
describe("remote data source", () => {
  const DataWraper = () => {
    let [page, setPage] = useState(1);
    let [searchParam, setSearchParam] = useState("");

    let { page: activePage, data, loading } = usePagedData<string>({
      url: "/api/test",
      page,
      pageSize: 5,
      searchParam,
      resolve: (d) => {
        return d;
      },
      mock: {
        data: ["1", "2", "3", "4", "5"],
      },
    });

    const loadMore = () => {
      setPage(activePage + 1);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchParam(e.target.value);
    };

    return (
      <div>
        <input data-testid="searchInput" onChange={handleSearch} />
        <button type="button" data-testid="btnLoadMore" onClick={loadMore}>
          Load More
        </button>
        <div data-testid="active_page">{activePage}</div>
        <div data-testid="data_length">{data?.length}</div>
        <div data-testid="loading">{loading}</div>
      </div>
    );
  };

  it("paging works currectly", async () => {
    const { container } = render(<DataWraper />);
    let loadMoreButton = getByTestId(container, "btnLoadMore");
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    await waitFor(async () => {
      return (
        (await (await screen.findByTestId("loading")).innerHTML) === "false"
      );
    });
    let data_length_elm = await screen.findByTestId("data_length");
    let active_page_elm = await screen.getByTestId("active_page");
    expect(active_page_elm.innerHTML).toBe("4");
    expect(data_length_elm.innerHTML).toBe("5");
  });

  it("changing parameters resets to first page", async () => {
    const { container } = render(<DataWraper />);
    let searchInput = getByTestId(container, "searchInput");
    let loadMoreButton = getByTestId(container, "btnLoadMore");
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);
    fireEvent.change(searchInput, { target: { value: "New Value" } });

    await waitFor(async () => {
      return (
        (await (await screen.findByTestId("loading")).innerHTML) === "false"
      );
    });
    let active_page_elm = await screen.getByTestId("active_page");
    expect(active_page_elm.innerHTML).toBe("1");
  });
});

export {};
