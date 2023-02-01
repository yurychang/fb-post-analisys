import { useState } from 'react';
import { Button, Input, Navbar } from 'react-daisyui';
import useSWR from 'swr';

function App() {
    const [url104, setUrl104] = useState('');

    const [searchStr, setSearchStr] = useState('');

    const submit = () => {
        try {
            setSearchStr(new URL(url104).search);
        } catch (error) {}
    };

    const { data: jobList } = useSWR(
        searchStr && ['http://localhost:3000/104', searchStr],
        ([url, search]) => fetch(`${url}${search}`).then((r) => r.json())
    );

    return (
        <div>
            <Navbar className="shadow-md">
                <Navbar.Start>
                    <Button className="text-xl normal-case" color="ghost">
                        Crawler DB
                    </Button>
                </Navbar.Start>
            </Navbar>
            <main>
                <div
                    className="mx-auto py-6 max-w-[1000px]"
                    style={{ minHeight: 'calc(100vh - 64px)' }}
                >
                    <section>
                        <div className="text-4xl">104</div>
                        <div className="p-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">Url</span>
                                <Input
                                    value={url104}
                                    onChange={(e) => setUrl104(e.target.value)}
                                    size="sm"
                                    className="grow"
                                />
                                <Button size="sm" onClick={submit}>
                                    search
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;
