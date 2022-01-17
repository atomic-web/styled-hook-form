import { waitFor } from "@testing-library/dom";
import { renderHook } from "@testing-library/react-hooks";
import "jest-fix-undefined";
import { usePagedData } from "../paged-data";

describe("remote data source", () => {
 
  it("initial page other than 1" , async()=>{
      const initialPage = 5;
      const {result} = renderHook(()=>usePagedData({
        request: { url: "/api/test" },
        page: initialPage,
        pageSize: 5,
        lazy:true,
        mockResponse: (mock) => {
          mock.onGet("/api/test").reply(() => {
            return [200, { list: new Array(50).fill(0) }];
          });
        },
      }));

      await waitFor(() => result.current.page === initialPage, { timeout: 200 });

      await expect(result.current.page).toBe(initialPage);
  })
});

export {};
