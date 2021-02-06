import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import TimeField from "react-simple-timefield";
import Layout from "../../../../components/Layout";
import groups from "../../../../server/database/groups";
import styles from "../../../../styles/groups.module.css";
import profile from "../../../../styles/profile.module.css";

interface IEventsProps {
    user: string;
    group: string;
}

export default function CreateEvent({
    user: stringifiedUser,
    group: stringifiedGroup,
}: IEventsProps) {
    const [user, group] = [JSON.parse(stringifiedUser), JSON.parse(stringifiedGroup)];
    const [minDateEnabled, setMinDateEnabled] = useState(false);
    const [maxDateEnabled, setMaxDateEnabled] = useState(false);
    const [minDurEnabled, setMinDurEnabled] = useState(false);
    const [maxDurEnabled, setMaxDurEnabled] = useState(false);
    const [timeRange, setTimeRange] = useState<[string | null, string | null]>(["00:00", null]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), null]);
    const [invalidTimeRange, setInvalidTimeRange] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
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
                        await fetch(`/api/events/${group._id}/create`, {
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
                        window.location.reload();
                    }}
                    className={styles.form}
                >
                    <h2>Create a new event</h2>
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
                                : "Create"
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

    if (!group)
        return {
            notFound: true,
        };

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
        },
    };
};
