import { renderHook, act } from "@testing-library/react-hooks";
import "jest-fix-undefined";
import { usePagedData } from "../paged-data";

describe("remote data source", () => {
  it("paging works currectly", async () => {
    let res: any;
    await act(async () => {
      let { result, waitFor } = renderHook(() =>
        usePagedData<string>({
          request: { url: "/api/test" },
          page: 1,
          pageSize: 5,
          lazy:true,
          onResponse: (d) => {
            return d;
          },
          mockResponse: (mock) => {
            mock.onGet("/api/test").reply(() => {
              return [200, { list: ["1", "2", "3", "4", "5"] }];
            });
          },
        })
      );

      result.current.nextPage();
      await waitFor(() => result.current.page === 1, { timeout: 100 });
      result.current.nextPage();
      await waitFor(() => result.current.page === 2, { timeout: 100 });
      result.current.nextPage();
      await waitFor(() => result.current.page === 3, { timeout: 100 });
      res = result;
    });

    expect(res.current.page).toBe(3);
  });
});

export {};
