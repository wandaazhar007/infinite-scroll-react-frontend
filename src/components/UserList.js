import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import './userList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [limit, setLimit] = useState(40);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getUsers();
    // console.log(process.env.REACT_APP_ALL_USERS)
  }, [lastId, keyword]);

  const getUsers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_ALL_USERS}?search_query=${keyword}&lastId=${lastId}&limit=${limit}`
    );
    const newUsers = response.data.result;
    setUsers([...users, ...newUsers]);
    setTempId(response.data.lastId);
    setHasMore(response.data.hasMore);
  };

  const fetchMore = () => {
    setTimeout(() => {
      setLastId(tempId);
    }, 1000)
  };

  const searchData = (e) => {
    e.preventDefault();

    if (query.length === 0) {
      return
    }

    setLastId(0);
    setUsers([]);
    setKeyword(query);

  };
  const reset = () => {
    setKeyword("");
    setQuery("");
    setLastId(0);
    setUsers([]);
  };

  return (
    <div className="container mt-6 mobile-container-padding">
      <div className="columns">
        <div className="column is-centered">
          <form onSubmit={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find Something Here..."
                />
              </div>
              <div className="control">
                {keyword === "" ? (
                  <button type="submit" className="button is-success">
                    <span> Search</span>
                  </button>
                ) : (
                  <button type="button" className="button is-danger" onClick={reset}>
                    <span> Reset</span>
                  </button>
                )}
              </div>
            </div>
            {keyword && (
              <div className="result" onClick={reset}>
                <p>{keyword}</p>
              </div>
            )
            }
          </form>

          <InfiniteScroll
            dataLength={users.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
          >
            <table className="table is-striped is-bordered is-fullwidth mt-2">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default UserList;
