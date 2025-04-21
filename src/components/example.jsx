import {useEffect} from "react";


export const SomDbFilter = () => {
    const dispatch = useDispatch()
    const selectedColumns = useSelector(getSomDbSelectedColums)
    const filterRow = useSelector(getSomDbFilterRow)
    const expandedSomItemFilter = useSelector

    useEffect(() => {
        dispatch(someDBAction.setFilterRow(selectedColumns))
    }, [dispatch,selectedColumns]);

    return (
        <div>
            <SomeAccordion
            title="Параметры фильтра"
            showChild={filterRow?.length > 0}
            expanded={expandedSomItemFilter}
            setExpanded={(newValue) => dispatch(someObjAction.setExpandedSomeFilterItem(newValue))}
            >
                {filterRow?.map(({id,childId,name,charType}) => {
                    return <SomDbFilterItem id={id} childId={childId} name={name} charType={charType}/>
                })}
            </SomeAccordion>
        </div>
    )
}