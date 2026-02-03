/*
* Graph Filter Component
* AUTHORS: Jake Swanson, Jonathan Torrence
*
* CREATED: 2025-10-30
* UPDATED: 2025-11-12
*/

//Imports
import '../../../siteStyles.css';

//Graph Filter Component
export default function GraphFilter({handleSelect}){

    //Function to handle filter selection
    let useFilter = (e) => {
        handleSelect(e.target.value)
    }

    //Export for Graph Filter component
    return (
        <div className="selector content-background">
            <label htmlFor="filter-select" style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Select Filter:
            </label>
            <select
                id="filter-select"
                onChange={useFilter}
                defaultValue=""
            >
                <option value="">Select a Filter...</option>
                <option value="furthest_depth">
                    Furthest Depth
                </option>
            </select>
        </div>
    );
}
