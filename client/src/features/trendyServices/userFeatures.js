const fetchSaved = (type = 'tweet') => {
    return fetch('/fetchSaved', {
        method: 'POST',
        body: type
    })
}

const save = (type = 'tweet', data) => {
    return fetch('/save', {
        method: 'POST',
        body: {type, saveData: data}
    })
}

const deleteSaved = () => {
}

const share = () => {
    //to user email
    //type
    //saved table ma tyo chart/tweet ko id
}

