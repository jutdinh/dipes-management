const DEFAULT_PAGE_ICON = "6"

export default (state, action) => {
    switch (action.type) {

        case "helloworld":
            return HelloWorld(state, action)
            break;

        case "createPage":
            return createPage(state, action)
            break;

        case "removeCurrentPage":
            return removeCurrentPage(state, action);
            break;
        case "updatePageName":
            return updatePageName(state, action);
            break;

        case "createChildPage":
            return createChildPage(state, action);
            break;

        case "setHomePage":
            return setHomePage(state, action);
            break;

        case "setDraggingState":
            return setDraggingState(state, action);
            break;
        case "unsetBlock":
            return unsetFloatingBlock(state, action);
            break;

        case "setDraggingPage":
            return setDraggingPage(state, action);
            break;

        case "pageMoveToFront":
            return pageMoveToFront(state, action);
            break;

        case "pageMoveToBehind":
            return pageMoveToBehind(state, action);
            break;

        case "pageChangeIcon":
            return pageChangeIcon(state, action);

        case "pageSelected":
            return pageSelect(state, action);
            break;

        case "saveCache":
            return saveCache(state, action)
            break;
        case "initState":
            return initState(state, action);
            break;

        case "reverseNavBarState":
            return reverseNavBarState(state, action);
            break;

        case "addComponent":
            return addComponent(state, action);
            break;

        case "insertComponent":
            return insertComponent(state, action);
            break;

        case "setActiveComponent":
            return setActiveComponent(state, action);
            break

        case "setGridSystemState":
            return setGridSystemState(state, action);
            break;

        case "setHoverComponent":
            return setHoverComponent(state, action);
            break

        case "updateComponent":
            return updateComponent(state, action);
            break;

        case "modfifyComponentChildren":
            return modifyComponentChildren(state, action);
            break;

        case "removeComponent":
            return removeComponent(state, action);
            break;

        case "appendChildComponent":
            return appendChildComponent(state, action);
            break;
        case "UnboundBlock":
            return unboundBlock(state, action)
            break;

        case "overideSelectedComp":
            return overideSelectedComp( state, action);
            break
        
        default:
            return state;
    }
}

const findPage = (pages, page_id, path = []) => {
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i]

        if (page.page_id == page_id) {
            return [i]
        } else {
            const isExiested = findPage(page.children, page_id)

            if (isExiested.length > 0) {
                path.push(i)
                path.push(...isExiested)
            }
        }
    }
    return path
}

const changeDataByPath = (pages, json, path) => {
    if (path.length == 1) {
        const page = pages[path[0]]
        pages[path[0]] = { ...page, ...json }
    } else {
        if (pages[path[0]]) {
            pages[path[0]].children = changeDataByPath(pages[path[0]].children, json, path.slice(1, path.length))
        }
    }
    return pages
}

const getDataByPath = (pages, path) => {
    if (path.length == 1) {
        const page = pages[path[0]]
        return page
    } else {
        return getDataByPath(pages[path[0]].children, path.slice(1, path.length))
    }
}


const removePageByPath = (pages, path) => {
    if (path.length == 1) {
        const page = pages[path[0]]
        const newPages = pages.filter(p => p.page_id != page.page_id)
        return newPages
    } else {
        pages[path[0]].children = removePageByPath(pages[path[0]].children, path.slice(1, path.length))
        return pages
    }
}

const HelloWorld = (state, action) => {
    console.log("HELLO WORLD FROM REDUX")
    return state
}

const createPage = (state, action) => {
    const id = state.functions.getFormatedUUID()

    const newPage = {
        page_id: id,
        page_title: "Trang mới",
        is_home: false,
        icon: DEFAULT_PAGE_ICON,
        children: [],
        component: []
    }


    state.pages.push(newPage)

    return { ...state }
}

const removeCurrentPage = (state, action) => {
    /**
     * desc: Xóa trang đang được chọn, tức là trang đang được lưu trong cache
     */

    const { cache, pages } = state;
    const path = findPage(pages, cache.page.page_id)
    const page = getDataByPath(pages, path)

    const newPages = removePageByPath(pages, path)
    state.cache.page = {}
    return { ...state, pages: newPages }
}


const updatePageName = (state, action) => {

    /**
     * desc: Cập nhật trang đang được chọn với tên mới 
     */

    const { pages, cache } = state;
    const path = findPage(pages, cache.page.page_id)
    const page = getDataByPath(pages, path)

    page.page_title = action.payload.name
    const newPages = changeDataByPath(pages, page, path)

    return { ...state, pages: newPages }
}


const createChildPage = (state, action) => {

    /**
     * desc: Thêm một trang con vào danh sách children của trang hiện tại 
     */

    const { pages, cache } = state;

    const id = state.functions.getFormatedUUID()

    const newChildPage = {
        page_id: id,
        page_title: "Trang mới",
        is_home: false,
        icon: DEFAULT_PAGE_ICON,
        children: [],
        component: []
    }

    const path = findPage(pages, cache.page.page_id)
    const page = getDataByPath(pages, path)

    page.children.push(newChildPage)
    const newPages = changeDataByPath(pages, page, path)

    return { ...state, pages: newPages }
}

const setHomePage = (state, action) => {

    /**
     * desc: Đặt trang hiện tại thành trang chủ & Thay đổi path của trang chủ thành trang hiện tại
     * 
    */

    const { pages, cache } = state;
    const { homepath } = cache;
    let newPages = pages;
    if (homepath.length > 0) {
        const lastestHome = getDataByPath(pages, homepath)
        lastestHome.is_home = false;
        newPages = changeDataByPath(pages, lastestHome, homepath)
    }

    const path = findPage(pages, cache.page.page_id)
    const page = getDataByPath(pages, path)

    page.is_home = true
    newPages = changeDataByPath(pages, page, path)


    cache.homepath = path

    return { ...state, pages: newPages, cache }
}


const setDraggingState = (state, action) => {
    /**
     * desc: Đặt lại trạng thái mới cho dragging state, nếu payload rỗng thì đặt lại giá trị đối
     */


    let status = action.payload ? action.payload.status : undefined;

    if (status === undefined) {
        status = !state.isDragging
    }

    state.isDragging = status;
    return { ...state }
}

const unsetFloatingBlock = (state, action) => {

    const { floating } = state
    floating.block = undefined
    console.log("Block unset")
    return { ...state, floating }
}

const setDraggingPage = (state, action) => {
    /**
     * desc: Đặt giá trị cho trang đang đc nắm giữ trong lúc dragging state đang on
     */


    let page = action.payload ? action.payload.page : undefined;

    state.holdingPage = page;


    return { ...state }
}

const pageMoveToFront = (state, action) => {
    /**
     * desc: Dịch chuyển holding page tới vị trí mới phía trước trang được chọn
     */

    const { holdingPage, pages } = state;
    const page = action.payload ? action.payload.page : undefined

    if (page) {
        const oldPath = findPage(pages, holdingPage?.page_id)
        const cleasedPages = removePageByPath(pages, oldPath);
        const path = findPage(cleasedPages, page.page_id)
        if (path.length > 0) {
            if (path.length == 1) {
                const newPages = []
                for (let i = 0; i < cleasedPages.length; i++) {
                    if (cleasedPages[i].page_id == page.page_id) {
                        newPages.push(holdingPage)
                    }
                    newPages.push(cleasedPages[i])
                }
                state.pages = newPages;
            } else {
                const parent = getDataByPath(cleasedPages, path.slice(0, path.length - 1))
                const { children } = parent;
                const newChildren = []
                for (let i = 0; i < children.length; i++) {
                    if (children[i].page_id == page.page_id) {
                        newChildren.push(holdingPage)
                    }
                    newChildren.push(children[i])
                }
                parent.children = newChildren
                const newPages = changeDataByPath(cleasedPages, parent, path.slice(0, path.length - 1))
                state.pages = newPages;
            }
        }
    }

    return { ...state }
}


const pageMoveToBehind = (state, action) => {
    /**
     * DESC: dịch chuyển holding page đến phía sau trang được chọn
     */
    const { holdingPage, pages } = state;
    const page = action.payload ? action.payload.page : undefined

    if (page) {
        const oldPath = findPage(pages, holdingPage.page_id)
        const cleasedPages = removePageByPath(pages, oldPath);
        const path = findPage(cleasedPages, page.page_id)
        if (path.length > 0) {
            if (path.length == 1) {
                const newPages = []
                for (let i = 0; i < cleasedPages.length; i++) {
                    newPages.push(cleasedPages[i])
                    if (cleasedPages[i].page_id == page.page_id) {
                        newPages.push(holdingPage)
                    }
                }
                state.pages = newPages;
            } else {
                const parent = getDataByPath(cleasedPages, path.slice(0, path.length - 1))
                const { children } = parent;
                const newChildren = []
                for (let i = 0; i < children.length; i++) {
                    newChildren.push(children[i])
                    if (children[i].page_id == page.page_id) {
                        newChildren.push(holdingPage)
                    }
                }
                parent.children = newChildren
                const newPages = changeDataByPath(cleasedPages, parent, path.slice(0, path.length - 1))
                state.pages = newPages;
            }
        }
    }

    return { ...state }
}


const pageChangeIcon = (state, action) => {

    /**
     * DESC: Đổi ICON cho page
     */

    const { cache, pages } = state;

    const path = findPage(pages, cache.page.page_id)
    const id = action.payload.icon.id

    const newPages = changeDataByPath(pages, { icon: id }, path)
    state.pages = newPages

    return { ...state }
}


const pageSelect = (state, action) => {
    /**
     * DESC: Đặt page thành page đang được edit và lưu thay đổi của page cũ vào danh sách đợi
     */

    const { page } = action.payload;
    const { pages } = state
    const currentPage = state.page;

    if (currentPage) {
        const currentPath = findPage(pages, currentPage.page_id)
        state.pages = changeDataByPath(pages, { component: currentPage.component }, currentPath)
    }
    state.page = page;
    return { ...state }
}

const saveCache = (state, action) => {
    const { pages, page } = state;
    const stringifiedPages = JSON.stringify(pages)

    localStorage.setItem('DESIGN-UI/PAGES', stringifiedPages)

    return state
}


const initState = (state, action) => {
    const { pages } = action.payload;

    state.pages = pages ? pages : [];
    state.page = pages ? pages[0]: undefined

    return { ...state }
}

const reverseNavBarState = (state, action) => {
    state.cache.navbar = !state.cache.navbar
    return { ...state }
}

const addComponent = (state, action) => {
    const { block } = action.payload;

    if (block) {

        const { initialStates, page, floating, functions } = state;
        const newBlock = functions.fillIDToBlockAndChildren(JSON.parse(JSON.stringify(initialStates[block])))

        floating.block = undefined

        // console.log(initialStates)
        // console.log(newBlock)
        // initialStates[block].children = []
        page.component.push(newBlock)
    }
    return { ...state }
}

const flatteningComponents = (components) => {
    const cpns = []
    for( let i = 0; i < components.length; i++ ){
        const { children }= components[i]
        cpns.push({...components[i]}  )
        if( children ){
            cpns.push( ...flatteningComponents( children ) )
        }
    }
    return cpns
}


const setActiveComponent = (state, action) => {
    const { id } = action.payload;   
    const { page } = state;
    
    const flattenComponents = flatteningComponents( page.component )

    let target = flattenComponents.find( c => c.id == id )
    
    const component = target;

    const activeSet = [ id ]
    const activeCpns = [ target ]

    while( true && target){
        const nextTargetId = target.parent_id;
        target = flattenComponents.find( c => c.id == nextTargetId )

        if( target ){
            activeSet.push( target.id )     
            activeCpns.unshift( target )       
        }
    }   
    if( component ){

        const { name } = component;
        const propertySet = state.propertySets[name]
        state.propertySet = propertySet ? propertySet : []
        state.selectedCpn = component;
        state.selectedCpns = activeCpns;
    }
    

    // set property set to state
    state.cache.activeComponent = [ ...activeSet, id ]
    return { ...state }
}

const setHoverComponent = (state, action) => {
    const { id } = action.payload;
    state.cache.hoverComponent = id;
    return { ...state }
}

const updateChildComponent = (components, target_id, values) => {
    for (let i = 0; i < components.length; i++) {
        const cpn = components[i]
        const { id, children } = cpn;
        if (id == target_id) {
            components[i].props = { ...components[i].props, ...values }
        } else {
            if (children) {
                components[i].children = updateChildComponent(components[i].children, target_id, values)
            }
        }
    }
    return components
}

const updateComponent = (state, action) => {
    const { id, values } = action.payload;
    const { page, selectedCpn } = state;
    const { component } = page

    page.component = updateChildComponent(component, id, values)

    if( selectedCpn.id == id ){
        state.selectedCpn.props = { ...selectedCpn.props, ...values }
    }

    state.page = page;

    return { ...state };
}


const modifyChildrenRecursive = (components, target_id, newChildren) => {
    for (let i = 0; i < components.length; i++) {
        const cpn = components[i]
        const { id, children } = cpn;
        if (id == target_id) {
            components[i].children = newChildren
        } else {
            if (children) {
                components[i].children = modifyChildrenRecursive(components[i].children, target_id, newChildren)
            }
        }
    }
    return components
}

const modifyComponentChildren = (state, action) => {
    const { id, children } = action.payload;
    const { page } = state;
    const { component } = page    

    page.component = modifyChildrenRecursive(component, id, children)
    state.page = page;

    return { ...state };
}

const removeChildComponent = (components, target_id) => {
    let found = false
    for (let i = 0; i < components.length; i++) {
        const cpn = components[i]
        const { id, children } = cpn;
        if (id == target_id) {
            found = true
        } else {
            if (children && !found) {
                components[i].children = removeChildComponent(components[i].children, target_id)
            }
        }
    }

    if (found) {
        const newComponent = components.filter(cpn => cpn.id != target_id)
        return newComponent
    }
    return components
}

const removeComponent = (state, action) => {

    const { id } = action.payload;
    const { page } = state
    const { component } = page;
    const newCpn = removeChildComponent(component, id)
    state.page.component = newCpn
    state.selectedCpn = {}
    state.propertySet = []

    return { ...state }
}


const setGridSystemState = (state, action) => {
    const { status } = action.payload
    return { ...state, gridState: status }
}

const insertChildComponent = (components, target_id, position, block) => {
    const target = components.find(t => t.id == target_id)
    if (target) {
        const newComponents = []
        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]
            if (position == "front") {
                if (cpn.id == target_id) {
                    newComponents.push({parent_id: cpn.id, ...block})
                }
                newComponents.push(cpn)
            } else {
                newComponents.push(cpn)
                if (cpn.id == target_id) {
                    newComponents.push({parent_id: cpn.id, ...block})
                }
            }
        }
        return newComponents
    } else {
        for (let i = 0; i < components.length; i++) {
            if (components[i].children) {
                components[i].children = insertChildComponent(components[i].children, target_id, position, block)
            }
        }
        return components
    }
}

const insertComponent = (state, action) => {
    const { id, position, block } = action.payload;

    if (block) {

        const { initialStates, page, floating, functions } = state;

        // const newBlock = { ...initialStates[block], id: newid }              
        const newBlock = functions.fillIDToBlockAndChildren(JSON.parse(JSON.stringify(initialStates[block])))



        floating.block = undefined
        state.page.component = insertChildComponent(state.page.component, id, position, newBlock)
    }

    return { ...state }
}

const addChildToComponent = (components, target_id, block) => {
    for (let i = 0; i < components.length; i++) {
        const cpn = components[i]
        const { id, children } = cpn;
        if (id == target_id) {
            if (children != undefined) {
                components[i].children.push({ parent_id: id , ...block })
            }
        } else {
            if (children) {
                components[i].children = addChildToComponent(components[i].children, target_id, block)
            }
        }
    }
    return components
}




const appendChildComponent = (state, action) => {
    const { id, block } = action.payload;
    if (block) {

        const { initialStates, page, pages, floating, functions } = state;
        const newBlock = functions.fillIDToBlockAndChildren(JSON.parse(JSON.stringify(initialStates[block])))



        const newComponent = addChildToComponent(page.component, id, newBlock)
        page.component = newComponent;



        const newPages = pages.map(p => {
            if (p.page_id == page.page_id) {
                return page
            }
            return p
        })

        floating.block = undefined
        return { ...state, pages: newPages, page, floating }
    } else {
        return state
    }
}

const unboundBlock = (state, action) => {
    const { floating } = state
    floating.block = undefined;
    return { ...state, floating }
}


const overrideComponent = (components, target_id, component ) => {
    for (let i = 0; i < components.length; i++) {
        const cpn = components[i]
        const { id, children } = cpn;
        if (id == target_id) {
            components[i] = component
        } else {
            if (children) {
                components[i].children = overrideComponent(components[i].children, target_id, component)
            }
        }
    }
    return components
}

const overideSelectedComp = ( state, action ) => {
    const { component } = action.payload
    const { id } = component;
    const { page } = state;
    state.page.component = overrideComponent( page.component, id, component )
    state.selectedCpn = component

    return { ...state }
}
