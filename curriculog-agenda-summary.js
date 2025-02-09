async function fmt_row(proposal, count=-1)
{
    let proposal_id = proposal.id.split('-')[1]
    if (document.getElementById('summary-'+proposal_id).getElementsByClassName('summary-subtitle').length == 0 ||
        document.getElementById('summary-'+proposal_id).getElementsByClassName('clearfix').length == 0)
        proposal.getElementsByClassName('action-info')[0].click()
    let proposal_url = 'https://nwmissouri.curriculog.com/proposal:'+proposal.id.split('-')[1]+'/form'
    let proposal_name = proposal.getElementsByClassName('list-name')[0].textContent.trim()
    function wait_for_summary(proposal_id) {
        return new Promise(resolve => {
            if (document.getElementById('summary-'+proposal_id).getElementsByClassName('summary-subtitle').length > 0 &&
                document.getElementById('summary-'+proposal_id).getElementsByClassName('clearfix').length > 0)
                return resolve(document.getElementById('summary-'+proposal_id))
            const observer = new MutationObserver(mutations => {
                if (document.getElementById('summary-'+proposal_id).getElementsByClassName('summary-subtitle').length > 0 &&
                    document.getElementById('summary-'+proposal_id).getElementsByClassName('clearfix').length > 0)
                    {
                        observer.disconnect();
                        return resolve(document.getElementById('summary-'+proposal_id))
                    }

            })

            observer.observe(document.getElementById('summary-'+proposal_id), {childList: true, subtree: true})
        })
    }
    let summary = await wait_for_summary(proposal_id)
    let proposal_type = summary.getElementsByClassName('summary-subtitle')[0].textContent.trim()
    let metadata_rows = summary.getElementsByClassName('clearfix')[0].getElementsByClassName('rowitem')
    let proposal_origin
    for (let mdrow of metadata_rows) {
        if (mdrow.childNodes[1].textContent.trim() == 'Originator')
            proposal_origin = mdrow.childNodes[3].textContent.trim()
    }
    let trow = document.createElement('tr')
    let elt = document.createElement('td')
    elt.innerText = String(count)
    trow.appendChild(elt)
    elt = document.createElement('td')
    let plink = document.createElement('a')
    plink.innerText = proposal_name
    plink.href = proposal_url
    elt.appendChild(plink)
    trow.appendChild(elt)
    elt = document.createElement('td')
    elt.innerText = proposal_origin
    trow.appendChild(elt)
    elt = document.createElement('td')
    elt.innerText = proposal_type
    trow.appendChild(elt)
    return trow
}

async function build_table()
{
    if (document.getElementById("tablemodal"))
    {
        document.getElementById("tablemodal").style.display="block"
        return
    }
    let proposals = document.getElementById('curriculog-list-column-results-content').getElementsByClassName('status-active')
    //let iframe = document.createElement('iframe')
    let table = document.createElement('table')
    for (let idx = 0; idx < proposals.length; idx++)
    {
        table.appendChild(await fmt_row(proposals[idx], idx+1))
    }
    let modal = document.createElement('div')
    let modal_content = document.createElement('div')
    modal.id = "tablemodal"
    modal.style.display="none" 
    modal.style.position="fixed" 
    modal.style["background-color"]="rgba(0,0,0,0.4)" 
    modal.style.overflow="auto" 
    modal.style.height="100%" 
    modal.style.width="100%" 
    modal.style.top=0 
    modal.style.left = 0 
    modal.style["z-index"] = 1 
    document.body.appendChild(modal)

    modal_content.style["background-color"] = "#fefefe"
    modal_content.style.margin= "15% auto"
    modal_content.style.padding="20px"
    modal_content.style.border = "1px solid #888"
    modal_content.style.width="80%"

    

    let closebtn = document.createElement('span')
    closebtn.style.color="#aaa"
    closebtn.style.float="right"
    closebtn.style["font-size"] = "28px"
    closebtn.style["font-weight"] = "bold"
    closebtn.innerHTML="&times;"

    closebtn.onclick = function() {
        document.getElementById("tablemodal").style.display="none"
    }

    modal_content.appendChild(closebtn)
    modal_content.appendChild(table)
    modal.appendChild(modal_content)
    modal.style.display="block"


}

if (! document.getElementById('tableviewbtn'))
{
    let tvbtn = document.createElement("button")
    tvbtn.innerHTML="Create Table View"
    tvbtn.id = 'tableviewbtn'
    tvbtn.onclick=async() => {await build_table()}
    document.getElementById("curriculog-fields-column-content").appendChild(tvbtn)
}

//await build_table()
//let proposals = document.getElementById('curriculog-list-column-results-content').getElementsByClassName('status-active') 
//let proposal_name = proposals[0].getElementsByClassName('list-name')[0].textContent.trim()
//let purl = 'https://nwmissouri.curriculog.com/proposal:'+proposals[0].id.split('-')[1]+'/form' 
//document.getElementById('summary-'+proposal_id).getElementsByClassName('summary-subtitle')[0].textContent.trim()

//let proposal_origin
//for (let mdrow of metadata_rows) {
//  if (mdrow.childNodes[1].textContent.trim() == 'Originator')
//    proposal_origin = mdrow.childNodes[3].textContent.trim()
//}
