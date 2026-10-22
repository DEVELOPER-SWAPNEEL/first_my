from sqlalchemy import CheckConstraint, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Ticket(Base):
    __tablename__ = 'tickets'
    __table_args__ = (
        CheckConstraint("length(trim(title)) BETWEEN 1 AND 120", name='ticket_title_length'),
        CheckConstraint("length(description) <= 2000", name='ticket_description_length'),
        CheckConstraint("status IN ('open', 'in_progress', 'resolved')", name='ticket_status'),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default='open')
