
interface Props {
    errors?: Record<string, string>
}

/**
 * UI component for displaying errors
 */
export function Errors({ errors }: Props) {
    if (!errors) {
        return <></>
    }

    return (
        <>
            {
                Object.entries(errors).map(([key, value]) => (
                    <p key={key} className="bg-red-600 text-gray-200">{value}</p>
                ))
            }
        </>
    )
}