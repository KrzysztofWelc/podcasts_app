import React from "react";

export default function List({items, loading, isMore, moreHandler, style, CRUDMode, Component}) {
    return items.length ? (
        <div className={style || 'flex overflow-x-auto'}>

            {items.map(podcast => <Component key={podcast.id} CRUDMode={CRUDMode}  data={podcast}/>)}
            {isMore && <button onClick={moreHandler}>more</button>}
            {loading && <div className="spinner" role="status"/>}
    </div>
        )
        : null
}