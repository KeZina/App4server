const counter = {
    siteUsers: 0,
    roomUsers: 0,
    addSiteUsers() {
        this.siteUsers++;
    },
    removeSiteUsers() {
        this.siteUsers--;
    },
    getSiteUsers() {
        return this.siteUsers;
    }
}

module.exports = counter;