



export default function FilterByName({ filter, setFilter, handleFilter, handleClear }) {

    return (
    <div className="mb-3 d-flex gap-2">
        <input
        type="text"
        className="form-control"
        placeholder="Enter exact file name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        />
        <button
        className="btn btn-primary"
        onClick={handleFilter}
        disabled={!filter.trim()}
        >
        Filter
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
        Clear
        </button>
    </div>
    )
};