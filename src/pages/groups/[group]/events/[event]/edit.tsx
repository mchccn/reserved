import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import TimeField from "react-simple-timefield";
import Layout from "../../../../../components/Layout";
import events from "../../../../../server/database/events";
import groups from "../../../../../server/database/groups";
import styles from "../../../../../styles/groups.module.css";
import profile from "../../../../../styles/profile.module.css";

interface IEventsProps {
    user: string;
    group: string;
    event: string;
}

export default function EditEvent({
    user: stringifiedUser,
    group: stringifiedGroup,
    event: stringifiedEvent,
}: IEventsProps) {
    const [user, group, event] = [
        JSON.parse(stringifiedUser),
        JSON.parse(stringifiedGroup),
        JSON.parse(stringifiedEvent),
    ];
    const formatMinutes = (minutes: number) =>
        `${Math.floor(minutes / 60)
            .toString()
            .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
    const [minDateEnabled, setMinDateEnabled] = useState(!!new Date(event.minDate).getTime());
    const [maxDateEnabled, setMaxDateEnabled] = useState(!!new Date(event.maxDate).getTime());
    const [minDurEnabled, setMinDurEnabled] = useState(!!event.minDuration);
    const [maxDurEnabled, setMaxDurEnabled] = useState(!!event.maxDuration);
    const [timeRange, setTimeRange] = useState<[string | null, string | null]>([
        formatMinutes(event.minDuration),
        formatMinutes(event.maxDuration),
    ]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(event.minDate),
        new Date(event.maxDate),
    ]);
    const [invalidTimeRange, setInvalidTimeRange] = useState(false);
    const [name, setName] = useState(event.name);
    const [desc, setDesc] = useState(event.description);
    const toMinutes = (timeStr: string) =>
        timeStr
            .split(":")
            .reduce(
                (acc, cur, i) => (i === 0 ? acc + parseInt(cur) * 60 : acc + parseInt(cur)),
                0
            );

    useEffect(() => {
        if (!minDateEnabled) setDateRange([null, dateRange[1]]);
        if (!maxDateEnabled) setDateRange([dateRange[0], null]);
        if (!minDurEnabled) setTimeRange([null, timeRange[1]]);
        if (!maxDurEnabled) setTimeRange([timeRange[0], null]);
    }, [minDateEnabled, maxDateEnabled, minDurEnabled, maxDurEnabled]);

    useEffect(() => {
        setInvalidTimeRange(
            toMinutes(timeRange[0] || "00:00") > toMinutes(timeRange[1] || "00:00") &&
                minDurEnabled &&
                maxDurEnabled
        );
    }, [timeRange]);

    return (
        <Layout user={stringifiedUser}>
            <div className={styles.container}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await fetch(`/api/events/${group._id}/update`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name,
                                description: desc,
                                timeRange,
                                dateRange,
                            }),
                        });
                        const a = document.createElement(`a`);
                        a.href = `/groups/${group._id}/events`;
                        a.click();
                    }}
                    className={styles.form}
                >
                    <h2>Edit the event</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        placeholder="Name of the event"
                        maxLength={64}
                        required
                    />
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        name="description"
                        placeholder="Description of the event"
                        maxLength={256}
                        required
                    ></textarea>
                    <div className={styles.flex}>
                        <button
                            type="button"
                            onClick={() => setMinDateEnabled(!minDateEnabled)}
                            className={profile.edit}
                        >
                            {minDateEnabled ? "Disable" : "Enable"} minimum date
                        </button>
                        <button
                            type="button"
                            onClick={() => setMaxDateEnabled(!maxDateEnabled)}
                            className={profile.edit}
                        >
                            {maxDateEnabled ? "Disable" : "Enable"} maximum date
                        </button>
                    </div>
                    {minDateEnabled || maxDateEnabled ? (
                        <Calendar
                            onChange={(date) => {
                                if (Array.isArray(date))
                                    return setDateRange(date as [Date, Date]);
                                if (minDateEnabled && !maxDateEnabled)
                                    return setDateRange([date, null]);
                                if (maxDateEnabled && !minDateEnabled)
                                    return setDateRange([null, date]);
                            }}
                            calendarType="US"
                            minDetail="year"
                            selectRange={minDateEnabled && maxDateEnabled}
                            minDate={new Date()}
                            defaultValue={
                                minDateEnabled && !maxDateEnabled
                                    ? new Date()
                                    : maxDateEnabled && !minDateEnabled
                                    ? undefined
                                    : new Date()
                            }
                        />
                    ) : null}
                    <div className={styles.time}>
                        <button
                            type="button"
                            onClick={() => setMinDurEnabled(!minDurEnabled)}
                            className={profile.edit}
                        >
                            {minDurEnabled ? "Disable" : "Enable"} minimum duration
                        </button>
                        {minDurEnabled ? (
                            <div>
                                <span>(HH:MM)</span>
                                <TimeField
                                    value={timeRange[0] || "00:00"}
                                    onChange={(_, value) => setTimeRange([value, timeRange[1]])}
                                    input={<input type="text" />}
                                />
                            </div>
                        ) : null}
                    </div>
                    <div className={styles.time}>
                        <button
                            type="button"
                            onClick={() => setMaxDurEnabled(!maxDurEnabled)}
                            className={profile.edit}
                        >
                            {maxDurEnabled ? "Disable" : "Enable"} maximum duration
                        </button>
                        {maxDurEnabled ? (
                            <div>
                                <span>(HH:MM)</span>
                                <TimeField
                                    value={timeRange[1] || "00:00"}
                                    onChange={(_, value) => setTimeRange([timeRange[0], value])}
                                    input={<input type="text" />}
                                />
                            </div>
                        ) : null}
                    </div>
                    <input
                        type="submit"
                        value={
                            invalidTimeRange
                                ? "Maximum duration is less than the minimum"
                                : "Edit"
                        }
                        disabled={invalidTimeRange}
                        className={profile[invalidTimeRange ? "error" : "edit"]}
                    />
                </form>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const group = await groups.findById(ctx.query.group);

    if (!group.events.includes(ctx.query.event))
        return {
            notFound: true,
        };

    const event = await events.findById(ctx.query.event);

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            event: JSON.stringify(event),
        },
    };
};
