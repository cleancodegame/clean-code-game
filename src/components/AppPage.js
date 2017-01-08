import React from 'react';
import classnames from 'classnames';

function AppHeader({tall}) {
    return <div className="header">
        <div className="container header">
            <div className={classnames("header-text", { "tall": tall })}>
                <h1 className="pointer" onClick={() => window.location.reload()}>
                    The Clean Code Game
                </h1>
                <h2>
                    Версия C#
                </h2>
            </div>
        </div>
    </div>
}

function AppFooter() {
    return <div className="footer">
        <div className="container">
            <p className="text-muted">
                ©2015&nbsp;
                <a href="https://kontur.ru/career">
                    СКБ Контур
                </a>. Связаться с&nbsp;<a href="mailto:pe@kontur.ru">автором</a>
            </p>
        </div>
    </div>;
}

function AppPage({tallHeader, children}) {
    return (
        <div>
            <AppHeader tall={tallHeader} />
            <div className="container">
                {children}
            </div>
            <AppFooter />
        </div>
    );
}

export default AppPage;