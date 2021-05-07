import React from "react";

export default function List({items, loading, isMore, moreHandler, style, Component}) {
    return items.length ? (
        <div className={style || 'flex overflow-x-auto'}>

            {items.map(podcast => <Component key={podcast.id} data={podcast}/>)}
            {isMore && <button onClick={moreHandler}>more</button>}
            {loading && <div className="spinner" role="status"/>}
    </div>
        )
        : null
}