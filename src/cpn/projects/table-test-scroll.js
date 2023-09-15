import React from 'react';

function App() {
    const data = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 35 },
        { id: 4, name: 'Charlie', age: 35 },
        { id: 5, name: 'Charlie', age: 35 },
        { id: 6, name: 'Charlie', age: 35 },
        { id: 7, name: 'Charlie', age: 35 },
        { id: 8, name: 'Charlie', age: 35 },
        { id: 9, name: 'Charlie', age: 35 },

        // ... (thêm nhiều dòng dữ liệu khác ở đây)
    ];

    return (
        <div className="table-container">
      <div className="table-header">
        <div className="table-cell">ID</div>
        <div className="table-cell">Name</div>
        <div className="table-cell">Age</div>
        <div className="table-cell">Name</div>
        <div className="table-cell">Age</div>
      </div>
      <div className="table-body">
        {data.map(row => (
          <div className="table-row" key={row.id}>
            <div className="table-cell">{row.id}</div>
            <div className="table-cell">{row.name}</div>
            <div className="table-cell">{row.age}</div>
            <div className="table-cell">{row.name}</div>
            <div className="table-cell">{row.age}</div>
          </div>
        ))}
      </div>
    </div>

    );
}

export default App;
