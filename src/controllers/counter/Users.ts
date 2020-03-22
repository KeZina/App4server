const {User} = require('../../model/User');

interface iClassUsers {
    createUser: (socket: any, name: string, roomUrl: string) => void;
    updateUser: (socket: any, name: string, reason: string, roomUrl: string) => void;
    removeUser: (name: string) => void;
    getUser: (name: string) => any;
    getUsers: () => Array<string>;
    getRoomUsers: (roomUrl: string) => Array<string>;
    getRegisteredUsers: (name: string) => Promise<Array<iRegisteredUsers>>;
}
interface iRegisteredUsers {
    name: string;
    relation: string;
    dateOfRegistry: string;
    status: string;
    accountType: string;
}

class Users implements iClassUsers {
    public users: Array<any> = [];

    createUser(socket: any, name: string, roomUrl: string): void {
        const users: any = this.users.filter((user: any): any => user.name !== name);

        socket.name = name;
        socket.roomUrl = roomUrl;

        this.users = [...users, socket];
    }

    updateUser(socket: any, name: string, reason: string, roomUrl: string): void {
        // bicycle :)
        if(this.users.length === 0) {
            return;
        }

        const user: any = this.users.filter((user: any): any => user.name === name);
        const users: any = this.users.filter((user: any): any => user.name !== name);

        if(reason === 'enter') {
            socket.join(roomUrl);
            user[0].roomUrl = roomUrl;
        } else if(reason === 'exit') {
            socket.leave(roomUrl);
            user[0].roomUrl = null;
        }

        this.users = [...users, ...user];
    }

    removeUser(name: string): void {
        if(this.users.length === 0) return;
        
        const users: any = this.users.filter((user: any): any => user.name !== name);
        this.users = users;
    }

    getUser(name: string): any {
        const user: any = this.users.filter((user: any): any => user.name === name);
        return user[0];
    }

    getUsers(): Array<string> {
        const users: Array<string> = this.users.map((user: any): string => user.name);
        return users;
    }

    getRoomUsers(roomUrl: string): Array<string> {
        const roomUsers: Array<any> = this.users.filter((user: any): any => user.roomUrl === roomUrl);
        const users: Array<string> = roomUsers.map((user: any): string => user.name);

        return users;
    }

    async getRegisteredUsers(name: string): Promise<Array<iRegisteredUsers>> {
        const usersData: Array<any> = await User.find();
        const usersOnline: Array<string> = this.getUsers();

        // Rewrite below
        const usersRegistered: Array<iRegisteredUsers> = usersData.map((user: any): iRegisteredUsers => {
            const whatsRelation = () => {
                if(user.haveSuchFriend(name)) {
                    return 'Friend';
                } else if(user.name === name) {
                    return 'You';
                } else return 'Stranger'
            }

            return {
                name: user.name,
                relation: whatsRelation(),
                dateOfRegistry: new Date(user.dateOfRegistry).toDateString(),
                status: usersOnline.includes(user.name) ? 'Online' : 'Offline',
                accountType: user.hash ? 'Permanent' : 'Temporary'
            }
        })

        return usersRegistered;
    }
}
export const users = new Users();